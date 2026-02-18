import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { mutations, queries } from '../../api'
import { ROUTES } from '../../constants'
import SvgIcon from '../../shared/icons/SvgIcon'
import { Avatar } from '../../shared/image'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import type { AdminApproveVerificationPayload, SingleUser } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'
import ApproveUserVerificationModal from './ApproveUserVerificationModal'

const UsersTable = () => {
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { data, isLoading, refetch, isRefetching } = queries.useGetUsers(params)
  const { mutate } = mutations.useDeleteUser()
  const { mutate: updateUserStatus } = mutations.useUpdateUserStatus()
  const { mutate: startImpersonation } = mutations.useStartImpersonation()
  const { mutate: adminApproveVerification, isPending: isApprovingVerification } =
    mutations.useAdminApproveVerification()
  const [, setLoadingStates] = useState<Record<string, boolean>>({})
  const [tableKey, setTableKey] = useState(0)
  const { t } = useTranslation()
  const [approveModal, setApproveModal] = useState<{
    isOpen: boolean
    user: SingleUser | null
  }>({
    isOpen: false,
    user: null,
  })
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

  const columns: Column<SingleUser>[] = [
    {
      title: 'name',
      sortable: true,
      sortField: 'name',
      dataField: [
        {
          field: 'name',
          renderer: (data: SingleUser) => (
            <div className="user-des">
              <Avatar data={data} name={data} />
              <div className="user-data">
                <div className="d-flex gap-1">
                  {data.is_verified && (
                    <div className="edit-icon-box">
                      <SvgIcon iconId="blue-tick" />
                    </div>
                  )}
                  <h5>{data?.name}</h5>
                </div>
                <span>{data?.email}</span>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'phone',
      sortable: true,
      sortField: 'phone',
      dataField: [
        {
          field: 'phone',
          renderer: (data: SingleUser) => <div className="user-des">{data.phone || '-'}</div>,
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
    {
      title: 'Status',
      dataField: [
        {
          field: 'status',
          type: COLUMN_TYPE.StatusSwitch,
          formatOptions: {
            statusSwitch: {
              actionMap: {
                deactivate: 'deactivate',
                activate: 'reactivate',
              },
              activeValue: 'active',
              inactiveValue: 'deactivated',
            },
          },
          checkCondition: (val: string) => val === 'active',
          onToggle: (row: SingleUser) =>
            handleActionPerform({
              actionToPerform: 'status',
              data: row,
            }),
        },
      ],
    },
  ]

  const actionsDropDown: (Action<SingleUser> | string)[] = [
    {
      label: 'Manage',
      actionToPerform: 'edit',
      renderer: (row: SingleUser) => {
        return (
          <Link
            to={ROUTES.EDIT_USERS.replace(':id', row.id.toString())}
            state={{ userData: row }}
            className="edit-icon-box"
          >
            <SvgIcon iconId="table-edit" />
          </Link>
        )
      },
    },
    'delete',
    {
      label: 'Verification',
      actionToPerform: 'Verification',
      renderer: (row: SingleUser) => {
        return (
          <div
            className="edit-icon-box"
            onClick={() =>
              handleActionPerform({
                actionToPerform: 'Verification',
                data: row,
              })
            }
          >
            <SvgIcon iconId="stroke-Verification" />
          </div>
        )
      },
    },
    {
      label: 'Impersonate',
      actionToPerform: 'Impersonate',
      renderer: (row: SingleUser) => {
        return (
          <div
            className="edit-icon-box"
            title="Start Impersonation"
            onClick={() =>
              handleActionPerform({
                actionToPerform: 'Impersonate',
                data: row,
              })
            }
          >
            <SvgIcon iconId="stroke-user" />
          </div>
        )
      },
    },
  ]

  const handleActionPerform = async ({ actionToPerform, data }: { actionToPerform: string; data: SingleUser }) => {
    const loadingKey = `${actionToPerform}-${data.id}`

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

      if (actionToPerform === 'delete') {
        showConfirmModal({
          variant: 'danger',
          iconId: 'table-delete',
          title: t('delete_user'),
          subtitle: `${t('delete_user_description')}`,
          confirmText: t('delete'),
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            mutate(
              { ids: [data.id] },
              {
                onSuccess: () => {
                  toaster('success', t('user_deleted_successfully'))
                  hideConfirmModal()
                  setTableKey((prev) => prev + 1)
                  refetch()
                },
                onError: () => {
                  toaster('error', t('failed_to_delete_user'))
                  setConfirmModal((prev) => ({ ...prev, isLoading: false }))
                },
              },
            )
          },
        })
        return
      } else if (actionToPerform === 'status') {
        const newStatus = data.status === 'active' ? 'deactive' : 'active'
        updateUserStatus(
          { id: data.id, status: newStatus },
          {
            onSuccess: () => {
              toaster('success', t('user_status_updated'))
              refetch()
            },
            onError: () => {
              toaster('error', t('failed_to_update_status'))
            },
          },
        )
      } else if (actionToPerform === 'Verification') {
        if (data.is_verified) {
          toaster('info', 'User is already verified')
          return
        }
        setApproveModal({
          isOpen: true,
          user: data,
        })
      } else if (actionToPerform === 'Impersonate') {
        try {
          startImpersonation(
            { targetUserId: data.id },
            {
              onSuccess: async (response) => {
                // Use hash instead of query param to hide token from URL and server logs
                const userAppUrl = import.meta.env.VITE_USER_APP_URL + `#token=${response.token}`
                window.location.replace(userAppUrl)
              },
              onError: () => {
                toaster('error', t('failed_to_impersonate'))
              },
            },
          )
        } catch (error) {
          console.error(error)
          toaster('error', 'Failed to start impersonation')
        }
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleApproveVerification = (payload: AdminApproveVerificationPayload) => {
    if (!approveModal.user) return

    const finalPayload: AdminApproveVerificationPayload = {
      ...payload,
      user_id: approveModal.user.id,
      full_name: approveModal.user.name,
    }

    adminApproveVerification(finalPayload, {
      onSuccess: (response) => {
        toaster('success', response.message || 'User verification approved successfully')
        setApproveModal({ isOpen: false, user: null })
        refetch()
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve verification'
        toaster('error', errorMessage)
      },
    })
  }

  const handleCloseApproveModal = () => {
    setApproveModal({ isOpen: false, user: null })
  }

  const handleBulkActions = (action: string, selectedUsers: SingleUser[]) => {
    if (action === 'delete' && selectedUsers.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('delete_users'),
        subtitle: `${t('delete_multiple_users_description', { count: selectedUsers.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids: selectedUsers.map((user) => user.id) },
            {
              onSuccess: () => {
                toaster('success', t('users_deleted_successfully', { count: selectedUsers.length }))
                hideConfirmModal()
                refetch()
              },
              onError: () => {
                toaster('error', t('failed_to_delete_users'))
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const config: TableConfig<SingleUser> = {
    columns,
    data: data?.users || [],
    actionsDropDown,
    total: data?.total,
  }

  return (
    <>
      <TableWrapper pagination={pagination} search={search} showDelete={true} handleBulkActions={handleBulkActions}>
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
        loadingText={t('processing')}
        iconId={confirmModal.iconId}
      />

      <ApproveUserVerificationModal
        isOpen={approveModal.isOpen}
        toggle={handleCloseApproveModal}
        onSubmit={handleApproveVerification}
        isLoading={isApprovingVerification}
        userName={approveModal.user?.name}
      />
    </>
  )
}

export default UsersTable
