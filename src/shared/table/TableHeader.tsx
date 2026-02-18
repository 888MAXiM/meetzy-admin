import { useTranslation } from 'react-i18next'
import type { Column } from '../../types/shared'
import SvgIcon from '../icons/SvgIcon'

export const TableHeader = <T extends Record<string, any>>({
  columns,
  visibleColumns,
  toggleSort,
  toggleAll,
  isAllSelected,
  hasActions,
  hasChecks,
}: {
  columns: Column<T>[]
  visibleColumns: Record<string, boolean>
  toggleSort: (col: Column<T>) => void
  toggleAll: () => void
  isAllSelected: boolean
  hasActions: boolean
  hasChecks: boolean
}) => {
  const { t } = useTranslation()

  return (
    <thead>
      <tr>
        {hasChecks && (
          <th className="checkbox-primary">
            <p className="custom-checkbox-wrapper">
              <input type="checkbox" className="checkbox_animated" checked={isAllSelected} onChange={toggleAll} />
              <span className="custom-checkbox"></span>
            </p>
          </th>
        )}
        {columns.map(
          (col, i) =>
            visibleColumns[col.title] && (
              <th className="sortable-header" key={i} onClick={() => col.sortable && toggleSort(col)}>
                <div className="head-link">
                  <span>{t(col.title)}</span>
                  {col.sortable && (
                    <div className="indicators-arrow">
                      <SvgIcon className="filter-arrow-top common-svg-hw" iconId="arrow-top" />
                      <SvgIcon className="filter-arrow-bottom common-svg-hw" iconId="arrow-bottom" />
                    </div>
                  )}
                </div>
              </th>
            ),
        )}
        {hasActions && (
          <th className="sortable-header">
            <span className="member-row">{t('actions')}</span>
          </th>
        )}
      </tr>
    </thead>
  )
}
