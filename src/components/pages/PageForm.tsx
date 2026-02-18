import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Col, Container, Label, Row } from 'reactstrap'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { ROUTES } from '../../constants'
import { typeOptions, usePageFormHelpers, validationSchema } from './usePageFormHelpers'
import type { SinglePage } from '../../types/api'
import type { FormValues, SelectOption } from '../../types/pages'
import { CkEditor, SwitchInput, TextInput } from '../../shared/formFields'
import SearchableSelect from '../../shared/formFields/SearchableSelectInput'
import { useAppSelector } from '../../redux/hooks'

const PageForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { user } = useAppSelector((store) => store.auth)
  const isEdit = !!id
  const pageData = location.state?.pageData as SinglePage | undefined
  const { handleSubmit } = usePageFormHelpers()

  const [initialValues, setInitialValues] = useState<FormValues>({
    title: '',
    slug: '',
    content: '',
    status: true,
    created_by: user?.id,
  })

  const [selectedType, setSelectedType] = useState<SelectOption | null>(typeOptions[2])

  useEffect(() => {
    if (isEdit && pageData) {
      setInitialValues({
        title: pageData.title,
        slug: pageData.slug,
        content: pageData.content,
        status: pageData.status,
        created_by: pageData.created_by,
      })
      const matched = typeOptions.find((opt) => opt.value === pageData.slug)
      setSelectedType(matched ?? typeOptions[2])
    }
  }, [isEdit, pageData])

  const handleCancel = () => {
    navigate(ROUTES.PAGES)
  }

  if (isEdit && !pageData) {
    return (
      <Container fluid>
        <Row>
          <Col xl="12">
            <CardWrapper
              heading={{
                title: 'edit_page',
                subtitle: 'error_loading_page',
              }}
            >
              <div className="text-center">
                <div className="alert background-l-primary">
                  <h5>Page Data Not Available</h5>
                  <p>Unable to load page details. Please go back and try editing again.</p>
                  <SolidButton className="btn-primary" onClick={() => navigate(ROUTES.PAGES)}>
                    Back to Page List
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
              title: isEdit ? 'edit_page' : 'add_new_page',
              subtitle: isEdit ? 'update_page_information' : 'create_a_new_page',
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, helpers) => handleSubmit(values, isEdit, id, navigate, helpers)}
              enableReinitialize
            >
              {({ values, errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                  <Row>
                    <Col md="6" className="mb-3">
                      <TextInput
                        name="title"
                        label="Title"
                        placeholder="Enter page title"
                        value={values.title}
                        onChange={(e) => setFieldValue('title', e.target.value)}
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <Label>Slug Options</Label>
                      <SearchableSelect
                        options={typeOptions}
                        value={selectedType}
                        onChange={(option: SelectOption | null) => {
                          setSelectedType(option)
                          if (!option) {
                            return
                          }
                          if (option.value === 'other') {
                            setFieldValue('slug', '')
                          } else {
                            setFieldValue('slug', option.value)
                          }
                        }}
                        placeholder="Select Page Type"
                        isClearable={false}
                      />
                    </Col>
                    <Col md="6" className="mb-3">
                      <TextInput
                        name="slug"
                        label="Slug"
                        placeholder="Enter page slug"
                        value={values.slug}
                        onChange={(e) =>
                          setFieldValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                        }
                        readOnly={!!selectedType && selectedType.value !== 'other'}
                      />
                    </Col>

                    <Col md="12" className="mb-3">
                      <CkEditor
                        name="content"
                        label="Content"
                        placeholder="Enter page content"
                        value={values.content}
                        onChange={(data) => setFieldValue('content', data)}
                        editorLoaded={true}
                        error={errors.content}
                        touched={touched.content}
                      />
                    </Col>

                    <Col md="6" className="mb-3">
                      <SwitchInput
                        name="status"
                        label="Status"
                        layout="horizontal"
                        onToggle={(checked) => {
                          setFieldValue('status', checked ? true : false)
                        }}
                      />
                    </Col>

                    <Col xs="12">
                      <div className="d-flex flex-wrap gap-2 justify-content-end">
                        <SolidButton type="button" className="btn-light" onClick={handleCancel} disabled={isSubmitting}>
                          Cancel
                        </SolidButton>
                        <SolidButton type="submit" className="btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : isEdit ? 'Update Page' : 'Create Page'}
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

export default PageForm
