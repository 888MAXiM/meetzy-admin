import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { mutations, queries } from '../../api'
import { ROUTES } from '../../constants'
import SvgIcon from '../../shared/icons/SvgIcon'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import type { SingleReportedAccounts } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'
import { typeOptions } from './useReportedAccountsHelpers'

const ReportedAccountsTable = () => {
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { data, isLoading, refetch, isRefetching } = queries.useGetReportedAccounts(params)
  const { mutate } = mutations.useDeleteReportedAccounts()
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

  const columns: Column<SingleReportedAccounts>[] = [
    {
      title: 'Reporter',
      sortable: true,
      sortField: 'name',
      dataField: [
        {
          field: 'name',
          renderer: (data) => (
            <div className="reportedAccounts-des">
              <div className="reportedAccounts-data">
                <p>{data?.reporter_id?.name || '-'}</p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Reported',
      sortable: true,
      sortField: 'reported_user',
      dataField: [
        {
          field: 'reported_user',
          renderer: (data) => (
            <div className="reportedAccounts-des">
              <div className="reportedAccounts-data">
                <p>{data?.reported_user_id?.name || data?.group?.name || '-'}</p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'chat_type',
      sortable: true,
      sortField: 'chat_type',
      dataField: [
        {
          field: 'chat_type',
          renderer: (data) => (
            <div className="reportedAccounts-des">
              <div className="reportedAccounts-data">
                <p>{data?.chat_type || '-'}</p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Reason',
      sortable: true,
      sortField: 'reason',
      dataField: [
        {
          field: 'reason',
          renderer: (data) => (
            <div className="reportedAccounts-des">
              <div className="reportedAccounts-data">
                <p>{data?.reason}</p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Description',
      sortable: true,
      sortField: 'description',
      dataField: [
        {
          field: 'description',
          renderer: (data) => (
            <div className="reportedAccounts-des">
              <div className="reportedAccounts-data">
                <p>{data?.description || '-'}</p>
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
          renderer: (data) => {
            const matched = typeOptions.find((opt) => opt.statusType === data?.status)
            return (
              <div className="reportedAccounts-des">
                <div className="reportedAccounts-data">
                  <p>{matched?.label}</p>
                </div>
              </div>
            )
          },
        },
      ],
    },
    {
      title: 'Admin Notes',
      sortable: true,
      sortField: 'admin_notes',
      dataField: [
        {
          field: 'admin_notes',
          renderer: (data) => (
            <div className="reportedAccounts-des">
              <div className="reportedAccounts-data">
                <p>{data?.admin_notes || '-'}</p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Resolver',
      sortable: true,
      sortField: 'resolver',
      dataField: [
        {
          field: 'resolver',
          renderer: (data) => (
            <div className="reportedAccounts-des">
              <div className="reportedAccounts-data">
                <p>{data?.resolver?.name || '-'}</p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'resolved_at',
      sortable: true,
      sortField: 'resolved_at',
      dataField: [
        {
          field: 'resolved_at',
          type: COLUMN_TYPE.Date,
          dateformatOptions: { showDate: true, showTime: false },
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

  const actionsDropDown: (Action<SingleReportedAccounts> | string)[] = [
    {
      label: 'edit',
      actionToPerform: 'edit',
      renderer: (row) => (
        <Link
          to={ROUTES.EDIT_REPORTED_ACCOUNTS.replace(':id', row.id.toString())}
          state={{ reportedAccountsData: row }}
          className="edit-icon-box"
        >
          <SvgIcon iconId="table-edit" />
        </Link>
      ),
    },
    'delete',
  ]

  const handleActionPerform = async ({
    actionToPerform,
    data,
  }: {
    actionToPerform: string
    data: SingleReportedAccounts
  }) => {
    const loadingKey = `${actionToPerform}-${data.id}`

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

      if (actionToPerform === 'delete') {
        showConfirmModal({
          variant: 'danger',
          iconId: 'table-delete',
          title: 'Delete Reported Accounts',
          subtitle: 'Are you sure you want to delete this reported accounts? This action cannot be undone.',
          confirmText: 'Delete',
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            mutate(
              { ids: [data.id] },
              {
                onSuccess: () => {
                  toaster('success', 'Reported Accounts deleted successfully')
                  hideConfirmModal()
                  refetch()
                },
                onError: () => {
                  toaster('error', 'Failed to delete Reported Accounts')
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

  const handleBulkActions = (action: string, selectedReportedAccounts: SingleReportedAccounts[]) => {
    if (action === 'delete' && selectedReportedAccounts.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('delete_reported_accounts_title'),
        subtitle: `${t('delete_multiple_reported_accounts_description', { count: selectedReportedAccounts.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids: selectedReportedAccounts.map((reportedAccounts) => reportedAccounts.id) },
            {
              onSuccess: () => {
                toaster(
                  'success',
                  t('reported_accounts_deleted_successfully', { count: selectedReportedAccounts.length }),
                )
                hideConfirmModal()
                refetch()
              },
              onError: () => {
                toaster('error', t('failed_to_delete_reported_accounts'))
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const config: TableConfig<SingleReportedAccounts> = {
    columns,
    data: data?.userReports || [],
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

export default ReportedAccountsTable
