import { Form, Formik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Col, Container, Label, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { languageList } from '../../data/language'
import localeFlags from '../../data/locale-flags.json'
import i18n from '../../i18n'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { SwitchInput, TextInput } from '../../shared/formFields'
import SearchableSelect from '../../shared/formFields/SearchableSelectInput'
import SvgIcon from '../../shared/icons/SvgIcon'
import { Image } from '../../shared/image'
import type { SingleLanguage } from '../../types/api'
import type { FormValues } from '../../types/languages'
import { SelectOption } from '../../types/pages'
import { toaster } from '../../utils/custom-functions'
import { getValidationSchema, useLanguageFormHelpers } from './useLanguageFormHelpers'

const getFlagFromLocale = (locale: string): string => {
  if (!locale) return ''
  const normalizedLocale = locale.toLowerCase().trim()
  if (localeFlags[normalizedLocale as keyof typeof localeFlags]) {
    return localeFlags[normalizedLocale as keyof typeof localeFlags]
  }
  const prefix = normalizedLocale.split('-')[0]
  if (localeFlags[prefix as keyof typeof localeFlags]) {
    return localeFlags[prefix as keyof typeof localeFlags]
  }
  return ''
}

const LanguageForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const languageData = location.state?.languageData as SingleLanguage | undefined
  const [fileName, setFileName] = useState<string | undefined>(undefined)
  const { handleSubmit } = useLanguageFormHelpers()
  const [selectedType, setSelectedType] = useState<SelectOption | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const [initialValues, setInitialValues] = useState<FormValues>({
    name: '',
    locale: '',
    isActive: true,
    translationFile: null,
    flag: '',
  })

  useEffect(() => {
    if (isEdit && languageData) {
      const flagEmoji = languageData.flag || getFlagFromLocale(languageData.locale)
      setInitialValues({
        name: languageData.name,
        locale: languageData.locale,
        isActive: languageData.is_active,
        translationFile: null,
        flag: flagEmoji,
      })
      const exitedValue = languageList.find((item) => item.value === languageData.locale)
      setSelectedType(exitedValue || languageList[0])
      setFileName(languageData?.metadata?.fileName)
    }
  }, [isEdit, languageData])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        toaster('error', 'Please upload a valid JSON file')
        return
      }
      setFieldValue('translationFile', file)
      setFilePreview(file.name)
      setFileName(file.name)
    }
  }

  const handleRemoveFile = (setFieldValue: any) => {
    setFieldValue('translationFile', null)
    setFileName(undefined)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


  const handleCancel = () => {
    navigate(ROUTES.LANGUAGES)
  }

  const downloadDemoJson = () => {
    try {
      const enTranslations = i18n.getResourceBundle('en', 'translations')
      const jsonString = JSON.stringify(enTranslations, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'en_demo_translations.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toaster('success', 'Downloaded demo JSON file')
    } catch {
      toaster('error', 'Failed to download demo JSON')
    }
  }

  if (isEdit && !languageData) {
    return (
      <Container fluid>
        <Row>
          <Col xl="12">
            <CardWrapper
              heading={{
                title: 'edit_language',
                subtitle: 'error_loading_language',
              }}
            >
              <div className="text-center">
                <div className="alert background-l-primary">
                  <h5>Language Data Not Available</h5>
                  <p>Unable to load language details. Please go back and try editing again.</p>
                  <SolidButton className="btn-primary" onClick={() => navigate(ROUTES.LANGUAGES)}>
                    Back to Language List
                  </SolidButton>
                </div>
              </div>
            </CardWrapper>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: isEdit ? 'edit_language' : 'add_new_language',
              subtitle: isEdit ? 'update_language_information' : 'create_a_new_language',
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={getValidationSchema(isEdit)}
              onSubmit={(values, helpers) =>
                handleSubmit(values, isEdit, id, navigate, helpers, languageData, fileName)
              }
              enableReinitialize
            >
              {({ values, isSubmitting, errors, setFieldValue }) => (
                <Form>
                  <Row>
                    <Col md="6" className="mb-3">
                      <TextInput
                        name="name"
                        label="Name"
                        placeholder="Enter language name"
                        value={values.name}
                        onChange={(e) => setFieldValue('name', e.target.value)}
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Locale</Label>
                      <SearchableSelect
                        name="locale"
                        placeholder="Enter locale (e.g., en, en-us, fr)"
                        options={languageList}
                        value={selectedType}
                        onChange={(option: SelectOption) => {
                          setSelectedType(option)
                          const locale = (option.value as string).toLowerCase()
                          setFieldValue('locale', locale)
                          const flagEmoji = getFlagFromLocale(locale)
                          setFieldValue('flag', flagEmoji)
                        }}
                        isClearable={false}
                      />
                      <div className="text-danger mt-1">{errors.locale}</div>
                    </Col>

                    <Col md="6">
                      <Label>Flag</Label>
                      <div className="settings-logo-upload border-0 p-0">
                        <div className="settings-logo-upload__images d-flex gap-3 align-items-center">
                          {values.flag ? (
                            <div className="upload-box has-image relative d-flex align-items-center justify-content-center" style={{ minWidth: '60px', minHeight: '60px', fontSize: '2.5rem' }}>
                              <span>{values.flag}</span>
                            </div>
                          ) : (
                            <div className="upload-box d-flex align-items-center justify-content-center" style={{ minWidth: '60px', minHeight: '60px' }}>
                              <span className="text-muted">No flag</span>
                            </div>
                          )}
                        </div>
                        <small className="text-muted">Flag is automatically set based on the selected locale</small>
                        {errors.flag && <div className="text-danger mt-1">{errors.flag}</div>}
                      </div>
                    </Col>

                    <Col md="6">
                      <Label>Translation File (JSON)</Label>
                      <div className="settings-logo-upload border-0 p-0">
                        <div className="settings-logo-upload__images d-flex gap-3">
                          <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                            <SvgIcon iconId="upload-img" />
                            <input
                              type="file"
                              hidden
                              ref={fileInputRef}
                              accept=".json,application/json"
                              onChange={(e) => handleFileChange(e, setFieldValue)}
                            />
                          </div>

                          {(filePreview || fileName) && (
                            <div className="upload-box has-image relative">
                              <div className="d-flex align-items-center justify-content-center h-100">
                                <SvgIcon iconId="file" className="me-2" />
                                <span className="text-truncate">{filePreview || fileName}</span>
                              </div>
                              <button
                                className="upload-box__remove absolute top-1 right-1"
                                type="button"
                                onClick={() => handleRemoveFile(setFieldValue)}
                              >
                                <SvgIcon iconId="close" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2"
                            onClick={downloadDemoJson}
                          >
                            <div className="edit-icon-box">
                              <SvgIcon iconId="download-files" />
                            </div>
                            <span>Download demo JSON for upload</span>
                          </button>
                        </div>
                        <small className="text-muted">{'Add translation data (admin + frontend)'}</small>
                        <div className="text-danger">{errors.translationFile}</div>
                      </div>
                    </Col>

                    <Col md="6" className="mb-3">
                      <SwitchInput
                        name="isActive"
                        label="Status"
                        layout="horizontal"
                        onToggle={(checked) => {
                          setFieldValue('isActive', checked ? true : false)
                        }}
                      />
                    </Col>

                    <Col xs="12">
                      <div className="d-flex flex-wrap gap-2 justify-content-end">
                        <SolidButton type="button" className="btn-light" onClick={handleCancel} disabled={isSubmitting}>
                          Cancel
                        </SolidButton>
                        <SolidButton type="submit" className="btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : isEdit ? 'Update Language' : 'Create Language'}
                        </SolidButton>
                      </div>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default LanguageForm
