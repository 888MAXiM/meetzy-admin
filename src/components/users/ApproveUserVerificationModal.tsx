import { useState, useEffect } from 'react'
import { Form, Formik, FormikHelpers } from 'formik'
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import * as Yup from 'yup'
import SearchableSelect from '../../shared/formFields/SearchableSelectInput'
import type { OptionType } from '../../types/shared'
import type { AdminApproveVerificationPayload } from '../../types/api'

interface ApproveUserVerificationModalProps {
  isOpen: boolean
  toggle: () => void
  onSubmit: (values: AdminApproveVerificationPayload) => void
  isLoading?: boolean
  userName?: string
}

interface ApproveVerificationFormValues {
  category: string
  admin_notes: string
}

const categoryOptions: OptionType[] = [
  { label: 'Individual', value: 'individual' },
  { label: 'Business', value: 'business' },
  { label: 'Creator', value: 'creator' },
]

const ApproveUserVerificationModal = ({
  isOpen,
  toggle,
  onSubmit,
  isLoading = false,
  userName,
}: ApproveUserVerificationModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<OptionType | null>(null)

  const initialValues: ApproveVerificationFormValues = {
    category: '',
    admin_notes: '',
  }

  const validationSchema = Yup.object({
    category: Yup.string().required('Category is required'),
    admin_notes: Yup.string(),
  })

  const handleSubmit = (
    values: ApproveVerificationFormValues,
    { setSubmitting }: FormikHelpers<ApproveVerificationFormValues>,
  ) => {
    if (!selectedCategory) {
      setSubmitting(false)
      return
    }

    const payload: AdminApproveVerificationPayload = {
      user_id: '0', // Will be set by parent component
      category: selectedCategory.value as 'individual' | 'business' | 'creator',
      admin_notes: values.admin_notes.trim() || undefined,
    }
    onSubmit(payload)
    setSubmitting(false)
  }

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory(null)
    }
  }, [isOpen])

  const handleModalToggle = () => {
    toggle()
  }

  return (
    <Modal isOpen={isOpen} toggle={handleModalToggle} centered>
      <ModalHeader toggle={handleModalToggle}>Approve User Verification</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                {userName && (
                  <Col md="12" className="mb-3">
                    <Label>User</Label>
                    <div className="form-control" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                      {userName}
                    </div>
                  </Col>
                )}

                <Col md="12" className="mb-3">
                  <Label>
                    Category <span className="text-danger">*</span>
                  </Label>
                  <SearchableSelect
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={(option: OptionType | null) => {
                      setSelectedCategory(option)
                      setFieldValue('category', option?.value || '')
                    }}
                    placeholder="Select category"
                    isClearable={false}
                  />
                  {errors.category && touched.category && (
                    <div className="invalid-feedback d-block">{errors.category}</div>
                  )}
                </Col>

                <Col md="12" className="mb-3">
                  <Label for="admin_notes">Admin Notes (optional)</Label>
                  <textarea
                    id="admin_notes"
                    name="admin_notes"
                    className="form-control"
                    placeholder="Enter admin notes (optional)"
                    rows={4}
                    value={values.admin_notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.admin_notes && touched.admin_notes && (
                    <div className="invalid-feedback d-block">{errors.admin_notes}</div>
                  )}
                </Col>

                <Col md="12">
                  <div className="d-flex justify-content-end gap-2">
                    <Button color="secondary" onClick={handleModalToggle} disabled={isLoading || isSubmitting}>
                      Cancel
                    </Button>
                    <Button color="primary" type="submit" disabled={isLoading || isSubmitting || !selectedCategory}>
                      {isLoading || isSubmitting ? 'Submitting...' : 'Approve'}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  )
}

export default ApproveUserVerificationModal
