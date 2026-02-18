import { Role } from '../../types/constants'
import type { Action } from '../../types/shared'
import { SolidButton } from '../button/SolidButton'
import SvgIcon from '../icons/SvgIcon'

export const processActions = <T extends Record<string, any>>(
  actions: (string | Action<T>)[],
  t: (key: string) => string,
  onActionPerform?: (action: { actionToPerform: string; data: T }) => void,
): Action<T>[] => {
  return actions.map((action) => {
    if (typeof action === 'string') {
      switch (action) {
        case 'edit':
          return {
            label: t('Edit'),
            actionToPerform: 'edit',
            renderer: (row: T) => (
              <SolidButton
                className="btn-primary"
                onClick={() => onActionPerform?.({ actionToPerform: 'edit', data: row })}
              >
                <SvgIcon className="common-svg-hw" iconId="table-edit" />
              </SolidButton>
            ),
          }
        case 'view':
          return {
            label: t('View'),
            actionToPerform: 'view',
            renderer: (row: T) => (
              <div className="view-icon-box" onClick={() => onActionPerform?.({ actionToPerform: 'view', data: row })}>
                <SvgIcon iconId="show-eye" />
              </div>
            ),
          }
        case 'make_admin':
          return {
            label: t('Make Admin'),
            actionToPerform: 'make_admin',
            renderer: (row: T) => {
              const isAdmin = row.role === 'admin' || row.group_role === Role.Admin
              return isAdmin ? (
                <SolidButton
                  className="btn-outline-danger"
                  onClick={() =>
                    onActionPerform?.({
                      actionToPerform: 'disable_rights',
                      data: row,
                    })
                  }
                >
                  {t('Disable Rights')}
                </SolidButton>
              ) : (
                <SolidButton
                  className="btn-make-admin btn-outline-primary"
                  onClick={() =>
                    onActionPerform?.({
                      actionToPerform: 'make_admin',
                      data: row,
                    })
                  }
                >
                  {t('Make Admin')}
                </SolidButton>
              )
            },
          }
        case 'delete':
          return {
            label: t('Delete'),
            actionToPerform: 'delete',
            renderer: (row: T) => (
              <div
                className="delete-icon-box"
                onClick={() => onActionPerform?.({ actionToPerform: 'delete', data: row })}
              >
                <SvgIcon iconId="table-delete" />
              </div>
            ),
          }
        default:
          return action
      }
    }
    return action
  }) as Action<T>[]
}
