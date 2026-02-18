import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { mutations, queries } from '../../api'
import { ROUTES } from '../../constants'
import SvgIcon from '../../shared/icons/SvgIcon'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import type { SinglePage } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'

const PagesTable = () => {
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { data, isLoading, refetch, isRefetching } = queries.useGetPages(params)
  const { mutate } = mutations.useDeletePage()
  const { mutate: updatePageStatus } = mutations.useUpdatePageStatus()
  const { t } = useTranslation()
  const [, setLoadingStates] = useState<Record<string, boolean>>({})

  const pagination = {
    ...basePagination,
    total: data?.data?.total || 0,
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

  const columns: Column<SinglePage>[] = [
    {
      title: 'Title',
      sortable: true,
      sortField: 'title',
      dataField: [
        {
          field: 'title',
          renderer: (data) => (
            <div className="page-des">
              <div className="page-data">
                <h6>{data?.title}</h6>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Slug',
      sortable: true,
      sortField: 'slug',
      dataField: [
        {
          field: 'slug',
          renderer: (data) => <span className="badge bg-light text-dark">{data?.slug}</span>,
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
          checkCondition: (val) => val,
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
          field: 'created_at',
          type: COLUMN_TYPE.Date,
          dateformatOptions: { showDate: true, showTime: false },
        },
      ],
    },
  ]

  const actionsDropDown: (Action<SinglePage> | string)[] = [
    {
      label: 'edit',
      actionToPerform: 'edit',
      renderer: (row) => (
        <Link
          to={ROUTES.EDIT_PAGE.replace(':id', row.id.toString())}
          state={{ pageData: row }}
          className="edit-icon-box"
        >
          <SvgIcon iconId="table-edit" />
        </Link>
      ),
    },
    'delete',
  ]

  const handleActionPerform = async ({ actionToPerform, data }: { actionToPerform: string; data: SinglePage }) => {
    const loadingKey = `${actionToPerform}-${data.id}`

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

      if (actionToPerform === 'delete') {
        showConfirmModal({
          variant: 'danger',
          iconId: 'table-delete',
          title: 'Delete Page',
          subtitle: 'Are you sure you want to delete this page? This action cannot be undone.',
          confirmText: 'Delete',
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            mutate(
              { ids: [data.id] },
              {
                onSuccess: () => {
                  toaster('success', 'Page deleted successfully')
                  hideConfirmModal()
                  refetch()
                },
                onError: () => {
                  toaster('error', 'Failed to delete page')
                  setConfirmModal((prev) => ({ ...prev, isLoading: false }))
                },
              },
            )
          },
        })
        return
      } else if (actionToPerform === 'status') {
        const pageToUpdate = data as SinglePage
        const newStatus = pageToUpdate.status ? false : true

        updatePageStatus(
          {
            id: pageToUpdate.id,
            status: newStatus,
          },
          {
            onSuccess: () => {
              toaster('success', 'Page status updated successfully')
              refetch()
            },
            onError: () => {
              toaster('error', 'Failed to update page status')
            },
          },
        )
        return
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleBulkActions = (action: string, selectedPages: SinglePage[]) => {
    if (action === 'delete' && selectedPages.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('delete_pages_title'),
        subtitle: `${t('delete_multiple_pages_description', { count: selectedPages.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids: selectedPages.map((page) => page.id) },
            {
              onSuccess: () => {
                toaster('success', t('pages_deleted_successfully', { count: selectedPages.length }))
                hideConfirmModal()
                refetch()
              },
              onError: () => {
                toaster('error', t('failed_to_delete_pages'))
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const config: TableConfig<SinglePage> = {
    columns,
    data: data?.data?.pages || [],
    actionsDropDown,
    total: data?.data?.total,
  }

  return (
    <>
      <TableWrapper pagination={pagination} search={search} handleBulkActions={handleBulkActions} showDelete={true}>
        <CommonTable
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

export default PagesTable
