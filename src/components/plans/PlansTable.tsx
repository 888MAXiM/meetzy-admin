import { useTranslation } from 'react-i18next'
import { mutations, queries } from '../../api'
import { ROUTES } from '../../constants'
import CommonTable from '../../shared/table'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'
import { useState } from 'react'
import { ConfirmModal } from '../../shared/modal'
import { toaster } from '../../utils/custom-functions'
import { COLUMN_TYPE } from '../../types/constants'
import { Link } from 'react-router-dom'
import SvgIcon from '../../shared/icons/SvgIcon'
import { SinglePlan } from '../../types/api'
import { Action, Column, TableConfig } from '../../types/shared'

const PlansTable = () => {
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { data, isLoading, refetch, isRefetching } = queries.useGetPlans(params)
  const { mutate } = mutations.useDeletePlan()
  const { mutate: updatePlanStatus } = mutations.useUpdatePlanStatus()
  const { mutate: setDefaultPlan } = mutations.useSetDefaultPlan()
  const { t } = useTranslation()
  const [tableKey, setTableKey] = useState(0)
  const [, setLoadingStates] = useState<Record<string, boolean>>({})

  const pagination = {
    ...basePagination,
    total: data?.data?.total || data?.total || 0,
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

  const columns: Column<SinglePlan>[] = [
    {
      title: 'Plan Name',
      dataField: [
        {
          field: 'name',
          renderer: (data) => (
            <div className="faq-des">
              <div className="faq-data">
                <h5>{data?.name}</h5>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Price',
      dataField: [
        {
          field: 'price_per_user_per_month',
          renderer: (data) => {
            const billingCycle = data?.billing_cycle
            const monthlyPrice = data?.price_per_user_per_month
            const yearlyPrice = data?.price_per_user_per_year

            return (
              <div>
                {billingCycle === 'monthly' || billingCycle === 'both' ? <div>${monthlyPrice}/month</div> : null}
                {billingCycle === 'yearly' || billingCycle === 'both' ? <div>${yearlyPrice}/year</div> : null}
              </div>
            )
          },
        },
      ],
    },
    {
      title: 'Max Members Per Group',
      dataField: [
        {
          field: 'max_members_per_group',
        },
      ],
    },
    {
      title: 'Max Broadcasts List',
      dataField: [
        {
          field: 'max_broadcasts_list',
        },
      ],
    },
    {
      title: 'Max Members/Broadcasts List',
      dataField: [
        {
          field: 'max_members_per_broadcasts_list',
        },
      ],
    },
    {
      title: 'Max Status',
      dataField: [
        {
          field: 'max_status',
        },
      ],
    },
    {
      title: 'Max Groups',
      dataField: [
        {
          field: 'max_groups',
        },
      ],
    },
    {
      title: 'Default',
      dataField: [
        {
          field: 'is_default',
          type: COLUMN_TYPE.Switch,
          checkCondition: (val) => val === true,
          onToggle: (row) =>
            handleActionPerform({
              actionToPerform: 'toggleDefault',
              data: { ...row },
            }),
        },
      ],
    },
    {
      title: 'Status',
      dataField: [
        {
          field: 'status',
          type: COLUMN_TYPE.Switch,
          checkCondition: (val) => val === 'active',
          onToggle: (row) =>
            handleActionPerform({
              actionToPerform: 'toggleStatus',
              data: { ...row },
            }),
        },
      ],
    },
    {
      title: 'created_at',
      dataField: [
        {
          type: COLUMN_TYPE.Date,
          field: 'created_at',
          dateformatOptions: { showDate: true, showTime: false },
        },
      ],
    },
  ]

  const actionsDropDown: (Action<SinglePlan> | string)[] = [
    {
      label: 'edit',
      actionToPerform: 'edit',
      renderer: (row) => (
        <Link
          to={ROUTES.EDIT_PLAN.replace(':id', row.id.toString())}
          state={{ planData: row }}
          className="edit-icon-box"
        >
          <SvgIcon iconId="table-edit" />
        </Link>
      ),
    },
    'delete',
  ]

  const handleActionPerform = async ({ actionToPerform, data }: { actionToPerform: string; data: SinglePlan }) => {
    const loadingKey = `${actionToPerform}-${data.id}`

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

      if (actionToPerform === 'delete') {
        showConfirmModal({
          variant: 'danger',
          iconId: 'table-delete',
          title: 'Delete Plan',
          subtitle: 'Are you sure you want to delete this plan? This action cannot be undone.',
          confirmText: t('delete'),
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            mutate(
              { ids: [data.id] },
              {
                onSuccess: () => {
                  toaster('success', 'Plan deleted successfully')
                  hideConfirmModal()
                  setTableKey((prev) => prev + 1)
                  refetch()
                },
                onError: (error) => {
                  console.error('Delete error:', error)
                  toaster('error', 'Failed to delete plan')
                  setConfirmModal((prev) => ({ ...prev, isLoading: false }))
                },
              },
            )
          },
        })
        return
      } else if (actionToPerform === 'toggleStatus') {
        const planToUpdate = data as SinglePlan
        const newStatus = planToUpdate.status === 'active' ? 'inactive' : 'active'

        updatePlanStatus(
          {
            id: planToUpdate.id,
            status: newStatus,
          },
          {
            onSuccess: () => {
              toaster('success', 'Plan status updated successfully')
              refetch()
            },
            onError: () => {
              toaster('error', 'Failed to update plan status')
            },
          },
        )
        return
      } else if (actionToPerform === 'toggleDefault') {
        const planToUpdate = data as SinglePlan

        setDefaultPlan(
          {
            id: planToUpdate.id,
          },
          {
            onSuccess: () => {
              toaster('success', 'Default plan updated successfully')
              refetch()
            },
            onError: () => {
              toaster('error', 'Failed to update default plan')
            },
          },
        )
        return
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleBulkActions = (action: string, selectedPlans: SinglePlan[]) => {
    if (action === 'delete' && selectedPlans.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('delete_plan_title'),
        subtitle: `${t('delete_multiple_plans_description', { count: selectedPlans.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids: selectedPlans.map((plan) => plan.id) },
            {
              onSuccess: () => {
                toaster('success', t('plans_deleted_successfully', { count: selectedPlans.length }))
                hideConfirmModal()
                refetch()
              },
              onError: (error) => {
                console.error('Delete error:', error)
                toaster('error', t('failed_to_delete_plans'))
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const plansData = data?.data?.plans || data?.plans || []

  const config: TableConfig<SinglePlan> = {
    columns,
    data: plansData,
    actionsDropDown,
    total: data?.data?.total || data?.total,
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

export default PlansTable
