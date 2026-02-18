import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mutations, queries } from '../../api'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import type { SingleContactInquiry } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'

const ContactInquiriesTable = () => {
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { data, isLoading, refetch, isRefetching } = queries.useGetContactInquiries(params)
  const { mutate } = mutations.useDeleteContactInquiries()
  const { t } = useTranslation()
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

  const columns: Column<SingleContactInquiry>[] = [
    {
      title: 'Name',
      sortable: true,
      sortField: 'name',
      dataField: [
        {
          field: 'name',
          renderer: (data) => (
            <div className="ContactInquiries-des">
              <div className="ContactInquiries-data">
                <h6>{data?.name}</h6>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Email',
      sortable: true,
      sortField: 'email',
      dataField: [
        {
          field: 'email',
          renderer: (data) => <span>{data?.email || '-'}</span>,
        },
      ],
    },
    {
      title: 'Subject',
      sortable: true,
      sortField: 'subject',
      dataField: [
        {
          field: 'subject',
          renderer: (data) => <span>{data?.subject}</span>,
        },
      ],
    },
    {
      title: 'Message',
      sortable: true,
      sortField: 'message',
      dataField: [
        {
          field: 'message',
          renderer: (data) => <span>{data?.message || '-'}</span>,
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

  const actionsDropDown: (Action<SingleContactInquiry> | string)[] = ['delete']

  const handleActionPerform = async ({
    actionToPerform,
    data,
  }: {
    actionToPerform: string
    data: SingleContactInquiry
  }) => {
    const loadingKey = `${actionToPerform}-${data.id}`

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

      if (actionToPerform === 'delete') {
        showConfirmModal({
          variant: 'danger',
          iconId: 'table-delete',
          title: 'Delete Contact Inquirie',
          subtitle: 'Are you sure you want to delete this Contact Inquirie? This action cannot be undone.',
          confirmText: 'Delete',
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            mutate(
              { ids: [data.id] },
              {
                onSuccess: () => {
                  toaster('success', 'Contact Inquirie deleted successfully')
                  hideConfirmModal()
                  refetch()
                },
                onError: () => {
                  toaster('error', 'Failed to delete Contact Inquirie')
                  setConfirmModal((prev) => ({ ...prev, isLoading: false }))
                },
              },
            )
          },
        })
        return
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleBulkActions = (action: string, selectedContactInquiries: SingleContactInquiry[]) => {
    if (action === 'delete' && selectedContactInquiries.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('delete_contact_inquiries_title'),
        subtitle: `${t('delete_multiple_contact_inquiries_description', { count: selectedContactInquiries.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids: selectedContactInquiries.map((ContactInquiries) => ContactInquiries.id) },
            {
              onSuccess: () => {
                toaster(
                  'success',
                  t('contact_inquiries_deleted_successfully', { count: selectedContactInquiries.length }),
                )
                hideConfirmModal()
                refetch()
              },
              onError: () => {
                toaster('error', t('failed_to_delete_contact_inquiries'))
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const config: TableConfig<SingleContactInquiry> = {
    columns,
    data: data?.inquiries || [],
    actionsDropDown,
    total: data?.total,
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

export default ContactInquiriesTable
