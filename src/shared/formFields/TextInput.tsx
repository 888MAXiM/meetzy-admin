import { useField, type FieldHookConfig } from 'formik'
import { useTranslation } from 'react-i18next'
import { FormFeedback, FormGroup, Input, Label } from 'reactstrap'
import { useState } from 'react'
import SvgIcon from '../icons/SvgIcon'
import type { TextInputProps } from '../../types/shared'

export default function TextInput({
  label,
  iconProps,
  containerClass = 'login-input',
  children,
  name,
  autoComplete = 'off',
  type = 'text',
  ...props
}: TextInputProps) {
  const { validate, labelClass, formGroupClass, required, ...inputProps } = props
  const fieldConfig: FieldHookConfig<string> = { name, validate }
  const [field, meta] = useField(fieldConfig)
  const { t } = useTranslation()

  const isPassword = type === 'password'
  const [show, setShow] = useState(false)
  const toggleVisibility = () => setShow((prev) => !prev)
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  const formGroupContent = (
    <FormGroup className={`text-start position-relative ${formGroupClass || ''}`}>
      {label && (
        <Label for={props.id || name} className={labelClass}>
          {t(label)}
        </Label>
      )}
      <Input
        {...field}
        {...inputProps}
        autoComplete={autoComplete}
        type={inputType}
        placeholder={props.placeholder ? t(props.placeholder) : undefined}
        invalid={meta.touched && !!meta.error}
        required={required}
      />
      {meta.touched && meta.error ? <FormFeedback>{meta.error}</FormFeedback> : null}
      {isPassword && (
        <div className="password-wrap" onClick={toggleVisibility} style={{ cursor: 'pointer' }}>
          <SvgIcon className="icon-eye" iconId={show ? 'show-eye' : 'hide-eye'} />
        </div>
      )}
      {children}
    </FormGroup>
  )

  return iconProps?.iconId ? (
    <div className={containerClass}>
      <SvgIcon {...iconProps} />
      {formGroupContent}
    </div>
  ) : (
    formGroupContent
  )
}
