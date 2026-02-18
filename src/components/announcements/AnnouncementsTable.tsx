import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mutations, queries } from '../../api'
import { Image } from '../../shared/image'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import type { Announcement } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'
import { ROUTES } from '../../constants'
import { Link } from 'react-router-dom'
import SvgIcon from '../../shared/icons/SvgIcon'

const AnnouncementsTable = () => {
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { data, isLoading, refetch, isRefetching } = queries.useGetAnnouncements(params)
  const { mutate } = mutations.useDeleteAnnouncement()
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

  const columns: Column<Announcement>[] = [
    {
      title: 'Media',
      dataField: [
        {
          field: 'file_url',
          renderer: (data) => (
            <div className="status-des">
              {data?.file_url ? (
                <Image className="text-truncate" src={data?.file_url} width={100} height={60} />
              ) : (
                <p className="p-10">N/A</p>
              )}
            </div>
          ),
        },
      ],
    },
    {
      title: 'Title',
      sortable: true,
      sortField: 'title',
      dataField: [
        {
          field: 'title',
          renderer: (data) => (
            <div className="status-des">
              <div className="status-data">
                <h6 className="fw-light">{data?.title || '-'}</h6>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Content',
      sortable: true,
      sortField: 'content',
      dataField: [
        {
          field: 'content',
          renderer: (data) => (
            <div className="status-des">
              <h6 className="fw-light">{data?.content || '-'}</h6>
            </div>
          ),
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

  const actionsDropDown: (Action<Announcement> | string)[] = [
    'delete',
    {
      label: 'edit',
      actionToPerform: 'edit',
      renderer: (row: Announcement) => {
        return (
          <Link
            to={ROUTES.EDIT_ANNOUNCEMENTS.replace(':id', row.id.toString())}
            state={{ AnnounceData: row }}
            className="edit-icon-box"
          >
            <SvgIcon iconId="show-eye" />
          </Link>
        )
      },
    },
  ]

  const handleActionPerform = async ({ actionToPerform, data }: { actionToPerform: string; data: Announcement }) => {
    const loadingKey = `${actionToPerform}-${data.id}`

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

      if (actionToPerform === 'delete') {
        showConfirmModal({
          variant: 'danger',
          iconId: 'table-delete',
          title: 'Delete Announcement',
          subtitle: 'Are you sure you want to delete this message? This action cannot be undone.',
          confirmText: t('delete'),
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            mutate(
              { announcement_ids: [data.id] },
              {
                onSuccess: () => {
                  toaster('success', 'announcements_deleted_successfully')
                  hideConfirmModal()
                  setTableKey((prev) => prev + 1)
                  refetch()
                },
                onError: () => {
                  toaster('error', 'failed_to_delete_announcements')
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

  const handleBulkActions = (action: string, selectedStatus: Announcement[]) => {
    if (action === 'delete' && selectedStatus.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('Delete Announcements'),
        subtitle: `${t('delete_multiple_Announcement_description', { count: selectedStatus.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { announcement_ids: selectedStatus.map((user) => user.id) },
            {
              onSuccess: () => {
                toaster('success', t('announcements_deleted_successfully', { count: selectedStatus.length }))
                hideConfirmModal()
                refetch()
              },
              onError: () => {
                toaster('error', t('failed_to_delete_announcements'))
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const config: TableConfig<Announcement> = {
    columns,
    data: data?.announcements || [],
    actionsDropDown,
    total: data?.total,
  }

  return (
    <>
      <TableWrapper pagination={pagination} search={search} handleBulkActions={handleBulkActions} showDelete={true}>
        <CommonTable
          key={tableKey}
          isLoading={isLoading}
          isRefetching={isRefetching}
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

export default AnnouncementsTable
