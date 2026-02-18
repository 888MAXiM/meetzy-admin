import { useField } from 'formik'
import Select from 'react-select'
import { Col, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import type { PhoneInputGroupProps } from '../../types/shared'
import { countryCodes } from '../../data/shared'

const PhoneInput = ({ label, name, codeName, containerClass, xxlClass = 2, xxlClass2 = 4 }: PhoneInputGroupProps) => {
  const [codeField, codeMeta, codeHelpers] = useField(codeName)
  const [phoneField, phoneMeta] = useField(name)
  const { t } = useTranslation()

  const countryCodeOptions = countryCodes.map((c) => ({
    label: c.name,
    value: c.code,
    flag: c.flag,
    displayCode: c.code,
  }))

  const selectedCode = countryCodeOptions.find((opt) => opt.value === codeField.value)

  return (
    <FormGroup className={`${containerClass ? containerClass : ''} text-start `}>
      {label && <Label>{label}</Label>}
      <Row className="g-2">
        <Col xxl={xxlClass} xl="4" sm="2" xs="4">
          <Select
            className="phone-input"
            defaultValue={countryCodeOptions}
            options={countryCodeOptions}
            value={selectedCode}
            onChange={(option) => {
              codeHelpers.setValue(option?.value || '')
            }}
            onBlur={() => codeHelpers.setTouched(true)}
            isClearable={false}
            isSearchable
            classNamePrefix="react-select"
            placeholder="Select"
            formatOptionLabel={(option) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {option.flag.startsWith('http') ? (
                  <img src={option.flag} alt={option.label} width={20} height={15} style={{ objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.2rem' }}>{option.flag}</span>
                )}
                <span>{option.displayCode}</span>
              </div>
            )}
          />
          {codeMeta.touched && codeMeta.error && (
            <FormFeedback style={{ display: 'block' }}>{codeMeta.error}</FormFeedback>
          )}
        </Col>
        <Col xxl={xxlClass2} xl="8" sm="10" xs="8">
          <Input
            {...phoneField}
            type="tel"
            className="custom-input"
            placeholder={t('type_a_number')}
            invalid={phoneMeta.touched && !!phoneMeta.error}
          />
          {phoneMeta.touched && phoneMeta.error && <FormFeedback>{phoneMeta.error}</FormFeedback>}
        </Col>
      </Row>
    </FormGroup>
  )
}

export default PhoneInput
