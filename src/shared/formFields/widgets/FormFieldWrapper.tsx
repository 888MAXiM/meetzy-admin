import { FormFeedback, FormGroup, Label } from 'reactstrap'
import type { FormFieldWrapperProps } from '../../../types/shared'
import { useTranslation } from 'react-i18next'

const FormFieldWrapper = ({
  label,
  id,
  name,
  error,
  touched,
  helperText,
  layout = 'vertical',
  labelClass = '',
  formGroupClass = '',
  children,
}: FormFieldWrapperProps) => {
  const hasError = touched && !!error
  const { t } = useTranslation()

  return (
    <FormGroup className={`text-start position-relative ${formGroupClass}`}>
      {label && (
        <Label for={id || name} className={labelClass}>
          {t(label)}
        </Label>
      )}
      <div className={layout === 'horizontal' ? 'd-flex align-items-center gap-2' : ''}>{children}</div>
      {hasError && <FormFeedback>{error}</FormFeedback>}
      {helperText && !hasError && <small className="form-text text-muted">{helperText}</small>}
    </FormGroup>
  )
}

export default FormFieldWrapper
