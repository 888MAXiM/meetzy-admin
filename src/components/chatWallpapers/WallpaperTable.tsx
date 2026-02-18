import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { mutations, queries } from '../../api'
import { ROUTES } from '../../constants'
import SvgIcon from '../../shared/icons/SvgIcon'
import { Image } from '../../shared/image'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import type { SingleWallpaper } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'

const WallpaperTable = () => {
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { data, isLoading, refetch, isRefetching } = queries.useGetWallpapers(params)
  const { mutate } = mutations.useDeleteWallpaper()
  const { mutate: updateWallpaperStatus } = mutations.useUpdateWallpaperStatus()
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

  const columns: Column<SingleWallpaper>[] = [
    {
      title: 'Name',
      sortable: true,
      sortField: 'name',
      dataField: [
        {
          field: 'name',
          renderer: (data) => (
            <div className="Wallpaper-des">
              <div className="Wallpaper-data">
                <h5>{data?.title}</h5>
                <div className="Wallpaper-answer">
                  <span className="text-truncate">{data?.name}</span>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      title: 'Wallpaper',
      dataField: [
        {
          field: 'wallpaper',
          renderer: (data) => (
            <div className="Wallpaper-des">
              <Image className="text-truncate" src={data?.wallpaper} />
              <div className="Wallpaper-data">
                <h5>{data?.title}</h5>
                <div className="Wallpaper-answer"></div>
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
              titleKey: 'status',
              data: { ...row },
            }),
        },
      ],
    },
    {
      title: 'Default',
      sortable: true,
      sortField: 'is_default',
      dataField: [
        {
          field: 'is_default',
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
              titleKey: 'is_default',
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

  const actionsDropDown: (Action<SingleWallpaper> | string)[] = [
    {
      label: 'edit',
      actionToPerform: 'edit',
      renderer: (row) => (
        <Link
          to={ROUTES.EDIT_WALLPAPER.replace(':id', row.id.toString())}
          state={{ wallpaperData: row }}
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
    titleKey,
    data,
  }: {
    actionToPerform: string
    titleKey: string
    data: SingleWallpaper
  }) => {
    const loadingKey = `${actionToPerform}-${data.id}`

    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))

      if (actionToPerform === 'delete') {
        showConfirmModal({
          variant: 'danger',
          iconId: 'table-delete',
          title: 'Delete Wallpaper',
          subtitle: 'Are you sure you want to delete this Wallpaper? This action cannot be undone.',
          confirmText: t('delete'),
          onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isLoading: true }))
            mutate(
              { ids: [data.id] },
              {
                onSuccess: () => {
                  toaster('success', 'Wallpaper deleted successfully')
                  hideConfirmModal()
                  setTableKey((prev) => prev + 1)
                  refetch()
                },
                onError: () => {
                  toaster('error', 'Failed to delete Wallpaper')
                  setConfirmModal((prev) => ({ ...prev, isLoading: false }))
                },
              },
            )
          },
        })
        return
      } else if (actionToPerform === 'status') {
        const WallpaperToUpdate = data as SingleWallpaper
        const newDefault = !WallpaperToUpdate.is_default
        const newStatus = !WallpaperToUpdate.status

        const payload: { id: number; status?: boolean; isDefault?: boolean } = {
          id: WallpaperToUpdate.id,
        }

        console.log('🚀 ~ handleActionPerform ~ titleKey:', titleKey)
        if (titleKey === 'status') {
          payload.status = newStatus
        } else if (titleKey === 'is_default') {
          payload.isDefault = newDefault
        }

        updateWallpaperStatus(payload, {
          onSuccess: () => {
            toaster('success', 'Wallpaper status updated successfully')
            refetch()
          },
          onError: (error: any) => {
            toaster('error', error?.message)
          },
        })
        return
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const handleBulkActions = (action: string, selectedWallpaper: SingleWallpaper[]) => {
    if (action === 'delete' && selectedWallpaper.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('delete_wallpaper_title'),
        subtitle: `${t('delete_multiple_wallpaper_description', { count: selectedWallpaper.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids: selectedWallpaper.map((user) => user.id) },
            {
              onSuccess: () => {
                toaster('success', t('wallpaper_deleted_successfully', { count: selectedWallpaper.length }))
                hideConfirmModal()
                refetch()
              },
              onError: () => {
                toaster('error', t('failed_to_delete_wallpaper'))
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const config: TableConfig<SingleWallpaper> = {
    columns,
    data: data?.wallpapers || [],
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

export default WallpaperTable
