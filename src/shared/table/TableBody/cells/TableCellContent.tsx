import { Link } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import type { Column } from '../../../../types/shared'
import { formatDate, formatDateTime, formatNumber, getStatusBadgeClass } from '../../../../utils'
import { StatusSwitchCell } from './StatusSwitchCell'
import { COLUMN_TYPE } from '../../../../types/constants'

export const TableCellContent = <T extends Record<string, any>>({
  field,
  row,
  onActionPerform,
}: {
  field: Column<T>['dataField'][0]
  row: T
  onActionPerform?: (action: { actionToPerform: string; data: T }) => void
}) => {
  const val = row[field.field as keyof T]

  if (field.renderer) return <Fragment>{field.renderer(row)}</Fragment>

  switch (field.type) {
    case COLUMN_TYPE.Date:
      return (
        <span>
          {formatDate(val, field.formatOptions?.dateStyle || 'medium', {
            locale: field.formatOptions?.locale,
            timeZone: field.formatOptions?.timeZone,
          })}
        </span>
      )

    case COLUMN_TYPE.DateTime:
      return (
        <span>
          {formatDateTime(
            val,
            field.formatOptions?.dateStyle || 'medium',
            {
              hour12: field.formatOptions?.hour12,
              showSeconds: field.formatOptions?.showSeconds,
              timeStyle: field.formatOptions?.timeStyle,
              customFormat: field.formatOptions?.timeFormatOptions,
            },
            {
              locale: field.formatOptions?.locale,
              timeZone: field.formatOptions?.timeZone,
              separator: field.formatOptions?.separator || ' ',
            },
          )}
        </span>
      )

    case COLUMN_TYPE.Number:
      return (
        <span>{formatNumber(val, field.formatOptions?.decimalPlaces, field.formatOptions?.thousandSeparator)}</span>
      )

    case COLUMN_TYPE.Boolean:
      return (
        <span className={`badge ${val ? 'bg-success' : 'bg-secondary'}`}>
          {val ? field.formatOptions?.trueText || 'Yes' : field.formatOptions?.falseText || 'No'}
        </span>
      )

    case COLUMN_TYPE.TextProfile:
      return (
        <div className="text-profile">
          {String(val)
            .slice(0, field.formatOptions?.length || 2)
            .toUpperCase()}
        </div>
      )

    case COLUMN_TYPE.Link:
      return (
        <Link
          to={field.formatOptions?.baseUrl ? `${field.formatOptions.baseUrl}${val}` : String(val)}
          target={field.formatOptions?.newTab ? '_blank' : '_self'}
        >
          {field.formatOptions?.linkText || String(val)}
        </Link>
      )

    case COLUMN_TYPE.Status:
      return (
        <span className={`badge ${getStatusBadgeClass(val, field.formatOptions?.statusMap)}`}>
          {field.formatOptions?.statusMap?.[val] || String(val)}
        </span>
      )

    case COLUMN_TYPE.StatusSwitch:
      return <StatusSwitchCell field={field} row={row} val={val} onActionPerform={onActionPerform} />

    default:
      return <span>{String(val)}</span>
  }
}
