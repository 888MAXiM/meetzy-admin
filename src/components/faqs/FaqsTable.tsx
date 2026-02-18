import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { mutations, queries } from '../../api'
import { ROUTES } from '../../constants'
import SvgIcon from '../../shared/icons/SvgIcon'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import type { SingleFAQ } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'

const FaqsTable = () => {
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { data, isLoading, refetch, isRefetching } = queries.useGetFaqs(params)
  const { mutate } = mutations.useDeleteFaq()
  const { mutate: updateFaqStatus } = mutations.useUpdateFaqStatus()
  const { t } = useTranslation()
  const [tableKey, setTableKey] = useState(0)
  const [, setLoadingStates] = useState<Record<string, boolean>>({})

  const pagination = {
    ...basePagination,
    total: data?.total || 0,
  }

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    isLoading: false,
    onConfirm: () => {},
    title: '',
    subtitle: '',
    confirmText: 'confirm',
    variant: 'default' as 'default' | 'danger' | 'warning' | 'success' | 'info',
    iconId: '',
  })

  const showConfirmModal = (config: Partial<typeof confirmModal>) => {
    setConfirmModal((prev) => ({
      ...prev,
      isOpen: true,
      ...config,
    }))
  }

  const hideConfirmModal = () => {
    setConfirmModal((prev) => ({
      ...prev,
      isOpen: false,
      isLoading: false,
    }))
  }

  const columns: Column<SingleFAQ>[] = [
    {
      title: 'Question',
      sortable: true,
      sortField: 'title',
      dataField: [
        {
          field: 'title',
          renderer: (data) => (
            <div className="faq-des">
              <div className="faq-data">
                <h6>{data?.title}</h6>
                <div className="faq-answer">
                  <span className="text-truncate" style={{ maxWidth: '300px', display: 'block' }}>
                    {data?.description}
                  </span>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Status',
      sortable: true,
      sortField: 'status',
      dataField: [
        {
          field: 'status',
          type: COLUMN_TYPE.StatusSwitch,
          formatOptions: {
            statusSwitch: {
              actionMap: {
                deactivate: false,
                activate: true,
              },
              activeValue: true,
              inactiveValue: false,
            },
          },
          checkCondition: (val) => val === true,
          onToggle: (row) =>
            handleActionPerform({
              actionToPerform: 'status',
              data: { ...row },
            }),
        },
      ],
    },
    {
      title: 'created_at',
      sortable: true,
      sortField: 'created_at',
      dataField: [
        {
          type: COLUMN_TYPE.Date,
          field: 'created_at',
          dateformatOptions: { showDate: true, showTime: false },
        },
      ],
    },
  ]

  const actionsDropDown: (Action<SingleFAQ> | string)[] = [
    {
      label: 'edit',
      actionToPerform: 'edit',
      renderer: (row) => (
        <Link to={ROUTES.EDIT_FAQ.replace(':id', row.id.toString())} state={{ faqData: row }} className="edit-icon-box">
          <SvgIcon iconId="table-edit" />
        </Link>
      ),
    },
    'delete',
  ]

  const handleActionPerform = async ({ actionToPerform, data }: { actionToPerform: string; data: SingleFAQ }) => {
    const loadingKey = `${actionToPerform}-${data.id}`

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

      if (actionToPerform === 'delete') {
        showConfirmModal({
          variant: 'danger',
          iconId: 'table-delete',
          title: 'Delete FAQ',
          subtitle: 'Are you sure you want to delete this FAQ? This action cannot be undone.',
          confirmText: t('delete'),
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            mutate(
              { ids: [data.id] },
              {
                onSuccess: () => {
                  toaster('success', 'FAQ deleted successfully')
                  hideConfirmModal()
                  setTableKey((prev) => prev + 1)
                  refetch()
                },
                onError: () => {
                  toaster('error', 'Failed to delete FAQ')
                  setConfirmModal((prev) => ({ ...prev, isLoading: false }))
                },
              },
            )
          },
        })
        return
      } else if (actionToPerform === 'status') {
        const faqToUpdate = data as SingleFAQ
        const newStatus = faqToUpdate.status ? false : true

        updateFaqStatus(
          {
            id: faqToUpdate.id,
            status: newStatus,
          },
          {
            onSuccess: () => {
              toaster('success', 'FAQ status updated successfully')
              refetch()
            },
            onError: () => {
              toaster('error', 'Failed to update FAQ status')
            },
          },
        )
        return
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleBulkActions = (action: string, selectedFaqs: SingleFAQ[]) => {
    if (action === 'delete' && selectedFaqs.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('delete_faq_title'),
        subtitle: `${t('delete_multiple_faqs_description', { count: selectedFaqs.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids: selectedFaqs.map((user) => user.id) },
            {
              onSuccess: () => {
                toaster('success', t('faqs_deleted_successfully', { count: selectedFaqs.length }))
                hideConfirmModal()
                refetch()
              },
              onError: () => {
                toaster('error', t('failed_to_delete_faqs'))
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const config: TableConfig<SingleFAQ> = {
    columns,
    data: data?.faqs || [],
    actionsDropDown,
    total: data?.total,
  }

  return (
    <>
      <TableWrapper pagination={pagination} search={search} handleBulkActions={handleBulkActions} showDelete={true}>
        <CommonTable
          key={tableKey}
          isLoading={isLoading}
          isRefetching={isLoading || isRefetching}
          tableConfiguration={config}
          onActionPerform={handleActionPerform}
          sort={sort}
        />
      </TableWrapper>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={hideConfirmModal}
        onConfirm={confirmModal.onConfirm}
        isLoading={confirmModal.isLoading}
        variant={confirmModal.variant}
        title={confirmModal.title}
        subtitle={confirmModal.subtitle}
        confirmText={confirmModal.confirmText}
        loadingText="Processing..."
        iconId={confirmModal.iconId}
      />
    </>
  )
}

export default FaqsTable
