import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { ROUTES } from '../../constants'
import { useFaqFormHelpers, validationSchema } from './useFaqFormHelpers'
import type { SingleFAQ } from '../../types/api'
import type { FormValues } from '../../types/faqs'
import { SwitchInput, TextArea, TextInput } from '../../shared/formFields'

const FaqForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const faqData = location.state?.faqData as SingleFAQ | undefined
  const { handleSubmit } = useFaqFormHelpers()

  const [initialValues, setInitialValues] = useState<FormValues>({
    question: '',
    answer: '',
    statusSwitch: true,
  })

  useEffect(() => {
    if (isEdit && faqData) {
      setInitialValues({
        question: faqData.title,
        answer: faqData.description,
        statusSwitch: faqData.status === true,
      })
    }
  }, [isEdit, faqData])

  const handleCancel = () => {
    navigate(ROUTES.MANAGE_FAQS)
  }

  if (isEdit && !faqData) {
    return (
      <Container fluid>
        <Row>
          <Col xl="12">
            <CardWrapper
              heading={{
                title: 'edit_faq',
                subtitle: 'error_loading_faq',
              }}
            >
              <div className="text-center">
                <div className="alert background-l-primary">
                  <h5>FAQ Data Not Available</h5>
                  <p>Unable to load FAQ details. Please go back and try editing again.</p>
                  <SolidButton className="btn-primary" onClick={() => navigate(ROUTES.MANAGE_FAQS)}>
                    Back to FAQ List
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
              title: isEdit ? 'edit_faq' : 'add_new_faq',
              subtitle: isEdit ? 'update_faq_information' : 'create_a_new_frequently_asked_question',
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => handleSubmit(values, isEdit, id, navigate, setSubmitting)}
              enableReinitialize
            >
              {({ values, isSubmitting, setFieldValue }) => (
                <Form>
                  <Row>
                    <Col md="12">
                      <TextInput
                        name="question"
                        label="Question"
                        placeholder="Enter FAQ question"
                        value={values.question}
                        onChange={(e) => setFieldValue('question', e.target.value)}
                      />
                    </Col>

                    <Col md="12">
                      <TextArea
                        name="answer"
                        label="Answer"
                        placeholder="Enter detailed answer"
                        rows={6}
                        value={values.answer}
                        onChange={(e) => setFieldValue('answer', e.target.value)}
                      />
                    </Col>

                    <Col md="12">
                      <SwitchInput
                        name="statusSwitch"
                        label="Status"
                        layout="horizontal"
                        onToggle={(checked) => {
                          setFieldValue('statusSwitch', checked)
                          setFieldValue('status', checked ? 'active' : 'inactive')
                        }}
                        formGroupClass="d-flex gap-2"
                      />
                    </Col>

                    <Col xs="12">
                      <div className="d-flex gap-2 flex-wrap justify-content-end">
                        <SolidButton
                          type="button"
                          color="light"
                          className="btn-light"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </SolidButton>
                        <SolidButton type="submit" className="btn-primary" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : isEdit ? 'Update FAQ' : 'Create FAQ'}
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

export default FaqForm
