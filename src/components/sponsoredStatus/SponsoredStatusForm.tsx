import { Form, Formik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { TextInput } from '../../shared/formFields'
import { SelectImage } from '../../shared/image'
import { ConfirmModal } from '../../shared/modal'
import { FormValues } from '../../types/status'
import { useSelectImage } from '../../utils/hooks/useSelectImage'
import { useStatusFormHelpers } from './useStatusFormHelpers'

const SponsoredStatusForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const { handleSubmit } = useStatusFormHelpers()
  const {
    avatarPreview,
    removeAvatar,
    confirmRemoveMemberOpen,
    avatar,
    hasAvatar,
    setConfirmRemoveMemberOpen,
    confirmRemoveAvatar,
    onAvatarChange,
    onRemoveAvatar,
  } = useSelectImage({ name: 's', image: '' })
  const initialValues: FormValues = {
    caption: '',
    status: '',
  }

  const handleCancel = () => {
    navigate(ROUTES.SPONSORED_STATUS)
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col xl="12">
            <CardWrapper
              heading={{
                title: 'add_new_status',
                subtitle: 'update_status_information',
              }}
            >
              <Formik
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting }) => {
                  const submitValues = {
                    ...values,
                    status: avatar || values.status,
                  }
                  handleSubmit(submitValues, isEdit, avatar, id, navigate, setSubmitting, removeAvatar)
                }}
                enableReinitialize
              >
                {({ values, isSubmitting, setFieldValue, errors, touched }) => (
                  <Form>
                    <Row>
                      <Col md="4">
                        <SelectImage
                          avatarPreview={avatarPreview}
                          removeAvatar={removeAvatar}
                          hasAvatar={hasAvatar}
                          onAvatarChange={(e) => {
                            onAvatarChange(e)
                            const file = e.target.files?.[0]
                            setFieldValue('status', file)
                          }}
                          onRemoveAvatar={() => {
                            onRemoveAvatar()
                            setFieldValue('status', null)
                          }}
                          removeBtn={true}
                        />
                        {touched.status && errors.status && (
                          <div className="text-danger small mt-1">{errors.status}</div>
                        )}
                      </Col>
                      <Col md="8">
                        <Row>
                          <Col md="12">
                            <TextInput
                              name="caption"
                              label="Caption"
                              placeholder="Enter Status Caption"
                              value={values.caption}
                              onChange={(e) => setFieldValue('caption', e.target.value)}
                            />
                          </Col>
                        </Row>
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
                            {isSubmitting ? 'Saving...' : 'Create Status'}
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
      <ConfirmModal
        isOpen={confirmRemoveMemberOpen}
        onClose={() => {
          setConfirmRemoveMemberOpen(false)
        }}
        onConfirm={confirmRemoveAvatar}
        title="Remove Status"
        subtitle={`Are you sure you want to remove status.`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        showIcon={true}
        iconId="table-delete"
      />
    </>
  )
}

export default SponsoredStatusForm
