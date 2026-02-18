import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Col, Container, Label, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { TextArea } from '../../shared/formFields'
import SearchableSelect from '../../shared/formFields/SearchableSelectInput'
import type { SingleReportedAccounts } from '../../types/api'
import type { FormValues, SelectOption } from '../../types/reportedAccounts'
import { typeOptions, useReportedAccountsHelpers } from './useReportedAccountsHelpers'

const ReportedAccountsForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const reportedAccountsData = location.state?.reportedAccountsData as SingleReportedAccounts | undefined
  const { handleSubmit } = useReportedAccountsHelpers()
  const [selectedType, setSelectedType] = useState<SelectOption | null>(typeOptions[2])

  const [initialValues, setInitialValues] = useState<FormValues>({
    status: '',
    adminNote: '',
  })

  useEffect(() => {
    if (isEdit && reportedAccountsData) {
      setInitialValues({
        status: reportedAccountsData.status,
        adminNote: reportedAccountsData.admin_notes,
      })
      const matched = typeOptions.find((opt) => opt.statusType === reportedAccountsData.status)
      setSelectedType(matched ?? typeOptions[2])
    }
  }, [isEdit, reportedAccountsData])

  const handleCancel = () => {
    navigate(ROUTES.REPORTED_ACCOUNTS)
  }

  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: isEdit ? 'edit_reported_accounts' : 'add_new_reported_accounts',
              subtitle: isEdit ? 'update_reported_accounts_information' : 'create_a_new_frequently_asked_question',
            }}
          >
            <Formik
              initialValues={initialValues}
              onSubmit={(values, formikHelpers) => handleSubmit(values, isEdit, id, navigate, formikHelpers)}
              enableReinitialize
            >
              {({ values, isSubmitting, setFieldValue }) => (
                <Form>
                  <Row>
                    <Col md="12" className="mb-3">
                      <Label>Status</Label>
                      <SearchableSelect
                        name="status"
                        placeholder="Enter Reported Accounts"
                        options={
                          reportedAccountsData?.chat_type === 'direct'
                            ? typeOptions
                            : typeOptions.filter((item) => item.statusType !== 'banned')
                        }
                        value={selectedType}
                        onChange={(option: SelectOption) => {
                          setSelectedType(option)
                          setFieldValue('status', option.statusType)
                        }}
                        isClearable={false}
                      />
                    </Col>

                    <Col md="12" className="mb-3">
                      <TextArea
                        name="adminNote"
                        label="Admin Note"
                        placeholder="Enter Admin Note"
                        rows={6}
                        value={values.adminNote || ''}
                        onChange={(e) => setFieldValue('adminNote', e.target.value)}
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
                          {isSubmitting ? 'Saving...' : isEdit ? 'Update Reported' : 'Create Reported'}
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

export default ReportedAccountsForm
