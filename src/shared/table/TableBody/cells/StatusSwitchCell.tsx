import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../../../../redux/hooks'
import type { Column } from '../../../../types/shared'
import { ConfirmModal } from '../../../modal'

interface StatusSwitchCellProps<T extends Record<string, any>> {
  field: Column<T>['dataField'][0]
  row: T
  val: any
  onActionPerform?: (action: { actionToPerform: string; titleKey: string; data: T }) => void
}

export const StatusSwitchCell = <T extends Record<string, any>>({
  field,
  row,  
  val,
  onActionPerform,
}: StatusSwitchCellProps<T>) => {
  const isCurrentlyActive = field.formatOptions?.statusSwitch?.activeValue === val
  const [isSwitchOn, setIsSwitchOn] = useState(isCurrentlyActive)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState(false)
  const { loading } = useAppSelector((state) => state.loader)
  const switchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const newActiveState = field.formatOptions?.statusSwitch?.activeValue === val
    setIsSwitchOn(newActiveState)
  }, [val, field.formatOptions?.statusSwitch?.activeValue])

  const handleToggle = () => {
    if (loading || pendingUpdate) return
    setShowConfirmation(true)
  }

  const handleConfirm = async () => {
    const newValue = !isSwitchOn
    setPendingUpdate(true)
    setShowConfirmation(false)

    const action = newValue
      ? field.formatOptions?.statusSwitch?.actionMap?.activate || 'reactivate'
      : field.formatOptions?.statusSwitch?.actionMap?.deactivate || 'deactivate'

    try {
      await onActionPerform?.({
        actionToPerform: 'status',
        titleKey: field.field as string,
        data: {
          ...row,
          action: action,
          field: field,
        },
      })
    } catch (err) {
      console.error('Failed to update status:', err)
      setIsSwitchOn(isSwitchOn)
    } finally {
      setPendingUpdate(false)
    }
  }

  const handleCancel = () => {
    if (switchRef.current) {
      switchRef.current.checked = isSwitchOn
    }
    setShowConfirmation(false)
  }

  return (
    <>
      <label className="custom-switch mt-3">
        <input
          type="checkbox"
          checked={isSwitchOn}
          onChange={handleToggle}
          disabled={loading || pendingUpdate}
          ref={switchRef}
        />
        <span className="slider" />
        {field.formatOptions?.statusSwitch?.activeLabel && (
          <span className="switch-label">
            {loading || pendingUpdate ? 'Processing...' : isSwitchOn ? 'Active' : 'Inactive'}
          </span>
        )}
      </label>

      <ConfirmModal
        subtitle={`Are you sure you want to ${!isSwitchOn ? 'activate' : 'deactivate'} this item?`}
        title={`Confirm ${!isSwitchOn ? 'Activation' : 'Deactivation'}`}
        variant="info"
        isOpen={showConfirmation}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        isLoading={loading || pendingUpdate}
      />
    </>
  )
}
