import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { mutations, queries } from '../../api'
import { ROUTES } from '../../constants'
import SvgIcon from '../../shared/icons/SvgIcon'
import { Image } from '../../shared/image'
import { ConfirmModal } from '../../shared/modal'
import CommonTable from '../../shared/table'
import type { SingleLanguage } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Action, Column, TableConfig } from '../../types/shared'
import { toaster } from '../../utils/custom-functions'
import TableWrapper from '../../utils/hoc/TableWrapper'
import { useTableManager } from '../../utils/hooks/useTablemanager'

const LanguagesTable = () => {
  const { pagination: basePagination, search, params, sort } = useTableManager()
  const { data, isLoading, refetch, isRefetching } = queries.useGetLanguages(params)
  const { mutate } = mutations.useDeleteLanguages()
  const { mutate: updateLanguageStatus } = mutations.useUpdateLanguageStatus()
  const { t } = useTranslation()
  const [, setLoadingStates] = useState<Record<string, boolean>>({})
  const [tableKey, setTableKey] = useState(0)

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

  const columns: Column<SingleLanguage>[] = [
    {
      title: 'name',
      sortable: true,
      sortField: 'name',
      dataField: [
        {
          field: 'name',
          renderer: (data) => {
            const isEmoji = data.flag && typeof data.flag === 'string' && /[\u{1F1E6}-\u{1F1FF}]{2}/u.test(data.flag);
            
            return (
              <div className="page-des">
                <div className="page-data d-flex gap-2 align-items-center">
                  {data.flag && (
                    isEmoji ? (
                      <span style={{ fontSize: '1.5rem' }}>{data.flag}</span>
                    ) : (
                      <Image src={data.flag} className="flag-image" />
                    )
                  )}
                  <h6>{data?.name}</h6>
                </div>
              </div>
            );
          },
        },
      ],
    },
    {
      title: 'locale',
      sortable: true,
      sortField: 'locale',
      dataField: [
        {
          field: 'locale',
          renderer: (data) => <span className="badge bg-light text-dark">{data?.locale?.toUpperCase()}</span>,
        },
      ],
    },
    {
      title: 'status',
      sortable: true,
      sortField: 'is_active',
      dataField: [
        {
          field: 'is_active',
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

  const downloadJsonFile = (language: SingleLanguage) => {
    try {
      if (!language.translation_json) {
        toaster('error', 'Translation data not available for this language')
        return
      }

      let jsonData: any
      if (typeof language.translation_json === 'string') {
        try {
          jsonData = JSON.parse(language.translation_json)
        } catch {
          toaster('error', 'Invalid JSON format in translation data')
          return
        }
      } else {
        jsonData = language.translation_json
      }

      const jsonString = JSON.stringify(jsonData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${language.locale}_translations.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toaster('success', `Downloaded ${language.name} translations`)
    } catch {
      toaster('error', 'Failed to download translation file')
    }
  }

  const actionsDropDown: (Action<SingleLanguage> | string)[] = [
    {
      label: 'edit',
      actionToPerform: 'edit',
      renderer: (row) => (
        <Link
          to={ROUTES.EDIT_LANGUAGE.replace(':id', row.id.toString())}
          state={{ languageData: row }}
          className="edit-icon-box"
        >
          <SvgIcon iconId="table-edit" />
        </Link>
      ),
    },
    'delete',
    {
      label: 'download',
      actionToPerform: 'download',
      renderer: (row) => (
        <div className="edit-icon-box">
          <SvgIcon
            iconId="download-files"
            onClick={(e) => {
              e.stopPropagation()
              downloadJsonFile(row)
            }}
            title="Download JSON"
          />
        </div>
      ),
    },
  ]

  const handleActionPerform = async (
    action: {
      actionToPerform: string
      data: SingleLanguage | SingleLanguage[]
    },
    setSelectedRowsCount?: (count: number) => void,
  ) => {
    const { actionToPerform, data: actionData } = action

    if (actionToPerform === 'delete') {
      const languagesToDelete = Array.isArray(actionData) ? actionData : [actionData]
      const ids = languagesToDelete.map((lang) => lang.id)

      showConfirmModal({
        title: t('delete_languages_title'),
        subtitle: t('delete_multiple_languages_description'),
        variant: 'danger',
        iconId: 'delete-icon',
        onConfirm: async () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids },
            {
              onSuccess: () => {
                toaster('success', t('languages_deleted_successfully'))
                hideConfirmModal()
                setTableKey((prev) => prev + 1)
                refetch()
                if (setSelectedRowsCount) setSelectedRowsCount(0)
              },
              onError: (error) => {
                toaster('error', t(error.message))
                hideConfirmModal()
              },
            },
          )
        },
      })
    } else if (actionToPerform === 'status') {
      const language = actionData as SingleLanguage
      setLoadingStates((prev) => ({ ...prev, [language.id]: true }))
      updateLanguageStatus(
        { id: language.id, status: !language.is_active },
        {
          onSuccess: () => {
            toaster('success', t('language_status_updated'))
            refetch()
            setLoadingStates((prev) => ({ ...prev, [language.id]: false }))
          },
          onError: (error: any) => {
            toaster('error', error.message)
            setLoadingStates((prev) => ({ ...prev, [language.id]: false }))
          },
        },
      )
    }
  }

  const handleBulkActions = (action: string, selectedUsers: SingleLanguage[]) => {
    if (action === 'delete' && selectedUsers.length > 0) {
      showConfirmModal({
        variant: 'danger',
        iconId: 'table-delete',
        title: t('delete_languages_title'),
        subtitle: `${t('delete_multiple_languages_description', { count: selectedUsers.length })}`,
        confirmText: t('delete'),
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, isLoading: true }))
          mutate(
            { ids: selectedUsers.map((user) => user.id) },
            {
              onSuccess: () => {
                toaster('success', t('languages_deleted_successfully', { count: selectedUsers.length }))
                hideConfirmModal()
                refetch()
              },
              onError: (error) => {
                toaster('error', t(error.message))
                setConfirmModal((prev) => ({ ...prev, isLoading: false }))
              },
            },
          )
        },
      })
    }
  }

  const tableConfiguration: TableConfig<SingleLanguage> = {
    data: data?.data?.pages || [],
    columns,
    actionsDropDown,
    total: data?.data?.total,
  }

  return (
    <>
      <TableWrapper pagination={pagination} search={search} showDelete={true} handleBulkActions={handleBulkActions}>
        <CommonTable
          key={tableKey}
          isLoading={isLoading}
          isRefetching={isLoading || isRefetching}
          tableConfiguration={tableConfiguration}
          onActionPerform={handleActionPerform}
          sort={sort}
        />
      </TableWrapper>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={hideConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        subtitle={confirmModal.subtitle}
        variant={confirmModal.variant}
        iconId={confirmModal.iconId}
        isLoading={confirmModal.isLoading}
        confirmText={confirmModal.confirmText}
      />
    </>
  )
}

export default LanguagesTable
