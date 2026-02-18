import { useField } from 'formik'
import FormFieldWrapper from './widgets/FormFieldWrapper'
import SvgIcon from '../icons/SvgIcon'
import type { SwitchInputProps } from '../../types/shared'

const SwitchInput = ({
  name,
  id,
  label,
  iconProps,
  containerClass = 'login-input',
  formGroupClass = '',
  labelClass = '',
  onToggle,
  disabled,
  helperText,
  checked,
  layout = 'horizontal',
}: SwitchInputProps) => {
  const [field, meta, helpers] = useField({ name, type: 'checkbox' })
  const inputId = id || name
  const isControlled = checked !== undefined
  const inputChecked = isControlled ? checked : field.value

  const switchElement = (
    <label className="custom-switch mb-0">
      <input
        id={inputId}
        name={name}
        checked={inputChecked}
        type="checkbox"
        disabled={disabled}
        onChange={(e) => {
          if (isControlled) {
            e.preventDefault()
            onToggle?.(!checked)
          } else {
            const newChecked = e.target.checked
            helpers.setValue(newChecked)
            onToggle?.(newChecked)
          }
        }}
      />
      <span className="slider" />
    </label>
  )

  const content = (
    <FormFieldWrapper
      label={label}
      id={inputId}
      name={name}
      error={meta.error}
      touched={meta.touched}
      helperText={helperText}
      layout={layout}
      labelClass={labelClass}
      formGroupClass={formGroupClass}
    >
      {switchElement}
    </FormFieldWrapper>
  )

  return iconProps?.iconId ? (
    <div className={containerClass}>
      <SvgIcon {...iconProps} />
      {content}
    </div>
  ) : (
    content
  )
}

export default SwitchInput
