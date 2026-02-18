import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import CardWrapper from '../../shared/card/CardWrapper'
import { Avatar } from '../../shared/image'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'
import type { GroupMember, RemoveMemberResponse } from '../../types/api'

const GroupMembers = () => {
  const { id } = useParams<{ id: string }>()
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { t } = useTranslation()
  const [tableKey, setTableKey] = useState(0)
  const { mutate: updateRoleMutate } = mutations.useUpdateGroupMemberRole()
  const { mutate: deleteChannelMember } = mutations.useRemoveMemberFromGroup()
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

  if (!id) {
    console.error('channel id is missing')
    return null
  }
  const { data, refetch, isRefetching, isLoading } = queries.useGetGroupMembers(
    { ...params, group_id: id },
    { enabled: !!id },
  )

  const pagination = {
    ...basePagination,
    total: data?.total_pages || 0,
  }

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

  const columns: Column<GroupMember>[] = [
    {
      title: t('name'),
      sortable: true,
      sortField: 'name',
      dataField: [
        {
          field: 'name',
          renderer: (data) => {
            return (
              <div className="group-des">
                <Avatar data={data} name={data} customClass="user-img img-50" />
                <div className="group-data">
                  <h6>{data?.name}</h6>
                  <span>{data?.email}</span>
                </div>
              </div>
            )
          },
        },
      ],
    },
    {
      title: t('joined_at'),
      sortable: true,
      sortField: 'joined_at',
      dataField: [
        {
          field: 'joined_at',
          type: COLUMN_TYPE.Date,
        },
      ],
    },
    {
      title: t('updated_at'),
      sortable: true,
      sortField: 'updated_at',
      dataField: [
        {
          field: 'updated_at',
          type: COLUMN_TYPE.Date,
        },
      ],
    },
  ]

  const actionsDropDown: (Action<GroupMember> | string)[] = ['make_admin', 'delete']

  const handleActionPerform = async ({ actionToPerform, data }: { actionToPerform: string; data: GroupMember }) => {
    try {
      if (actionToPerform === 'delete') {
        if (!data) {
          toaster('error', t('user_data_missing'))
          return
        }
        const user = data
        showConfirmModal({
          variant: 'danger',
          iconId: 'table-delete',
          title: t('delete_member_title'),
          subtitle: `${t('delete_member_description')}`,
          confirmText: t('delete'),
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            deleteChannelMember(
              { group_id: id, user_ids: [user.id] },
              {
                onSuccess: () => {
                  toaster('success', t('member_deleted_successfully'))
                  hideConfirmModal()
                  setTableKey((prev) => prev + 1)
                  refetch()
                },
                onError: () => {
                  setConfirmModal((prev) => ({ ...prev, isLoading: false }))
                },
              },
            )
          },
        })
        return
      }

      if (actionToPerform === 'make_admin') {
        if (!data) {
          toaster('error', t('user_data_missing'))
          return
        }

        if (data.group_role === 'admin') {
          toaster('error', t('already_an_admin'))
          return
        }

        showConfirmModal({
          variant: 'info',
          iconId: 'admin',
          confirmText: 'confirm',
          title: t('promote_to_admin_title'),
          subtitle: `${t('promote_to_admin_description')} ${data.name}`,
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            updateRoleMutate(
              {
                group_id: id,
                user_id: data?.id,
                new_role: 'admin',
              },
              {
                onSuccess: () => {
                  toaster('success', t('admin_promoted_successfully'))
                  hideConfirmModal()
                  refetch()
                },
                onError: () => {
                  setConfirmModal((prev) => ({ ...prev, isLoading: false }))
                },
              },
            )
          },
        })
        return
      }

      if (actionToPerform === 'disable_rights') {
        if (!data) {
          toaster('error', t('user_data_missing'))
          return
        }

        if (data.group_role !== 'admin') {
          toaster('error', t('user_not_admin'))
          return
        }

        showConfirmModal({
          variant: 'info',
          iconId: 'confirmation',
          confirmText: 'confirm',
          title: t('demote_admin_title'),
          subtitle: `${t('demote_admin_description')} ${data.name}`,
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            updateRoleMutate(
              {
                group_id: id,
                user_id: data?.id,
                new_role: 'member',
              },
              {
                onSuccess: () => {
                  toaster('success', t('admin_demoted_successfully'))
                  hideConfirmModal()
                  refetch()
                },
                onError: () => {
                  setConfirmModal((prev) => ({ ...prev, isLoading: false }))
                },
              },
            )
          },
        })
        return
      }
    } catch {
      toaster('error', t('action_failed'))
    }
  }

  const handleBulkActions = (action: string, selectedMembers: GroupMember[]) => {
    if (action === 'delete' && selectedMembers.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('delete_members_title'),
        subtitle: `${t('delete_multiple_users_description', { count: selectedMembers.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          deleteChannelMember(
            {
              group_id: id,
              user_ids: selectedMembers.map((member) => member?.id).filter(Boolean) as number[],
            },
            {
              onSuccess: (data: RemoveMemberResponse) => {
                toaster('success', data.message + { count: selectedMembers.length })
                toaster('success', data.details[0])
                hideConfirmModal()
                refetch()
              },
              onError: () => {
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const config: TableConfig<GroupMember> = {
    columns,
    data: data?.members || [],
    actionsDropDown,
    total: data?.total_pages,
  }

  return (
    <Container fluid>
      <Row>
        <Col xl="12" className="custom-manage-teams">
          <CardWrapper
            heading={{
              title: (data?.group_name.charAt(0).toUpperCase() || '') + data?.group_name.slice(1) || 'Manage Group',
            }}
            backBtn={true}
          >
            <TableWrapper
              pagination={pagination}
              search={search}
              handleBulkActions={handleBulkActions}
              showDelete={true}
            >
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
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default GroupMembers
