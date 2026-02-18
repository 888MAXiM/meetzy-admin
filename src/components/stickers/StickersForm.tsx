import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { SwitchInput, TextInput } from '../../shared/formFields'
import { SelectImage } from '../../shared/image'
import { ConfirmModal } from '../../shared/modal'
import { useSelectImage } from '../../utils/hooks/useSelectImage'
import EditStickersError from './EditStickersError'
import { useStickersFormHelpers, validationSchema } from './useStickersFormHelpers'
import type { SingleStickers } from '../../types/api'
import type { FormValues } from '../../types/stickers'

const StickersForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const stickersData = location.state?.stickersData as SingleStickers | undefined
  const { handleSubmit } = useStickersFormHelpers()
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
  } = useSelectImage({ name: stickersData?.title, image: stickersData?.sticker })
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: '',
    stickers: '',
    statusSwitch: true,
  })
  useEffect(() => {
    if (isEdit && stickersData) {
      setInitialValues({
        name: stickersData.title,
        stickers: stickersData.sticker || '',
        statusSwitch: stickersData.status === true,
      })
    }
  }, [avatar, isEdit, stickersData])

  const handleCancel = () => {
    navigate(ROUTES.STICKERS)
  }

  if (isEdit && !stickersData) {
    return <EditStickersError />
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col xl="12">
            <CardWrapper
              heading={{
                title: isEdit ? 'edit_stickers' : 'add_new_stickers',
                subtitle: isEdit ? 'update_stickers_information' : 'create_a_new_frequently_asked_question',
              }}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  const submitValues = {
                    ...values,
                    stickers: avatar || values.stickers,
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
                          name={stickersData?.title}
                          image={stickersData?.sticker}
                          avatarPreview={avatarPreview}
                          removeAvatar={removeAvatar}
                          hasAvatar={hasAvatar}
                          onAvatarChange={(e) => {
                            onAvatarChange(e)
                            const file = e.target.files?.[0]
                            setFieldValue('stickers', file)
                          }}
                          onRemoveAvatar={() => {
                            onRemoveAvatar()
                            setFieldValue('stickers', null)
                          }}
                          removeBtn={true}
                        />
                        {touched.stickers && errors.stickers && (
                          <div className="text-danger small mt-1">{errors.stickers}</div>
                        )}
                      </Col>
                      <Col md="8">
                        <Row>
                          <Col md="12">
                            <TextInput
                              name="name"
                              label="Name"
                              placeholder="Enter Stickers name"
                              value={values.name}
                              onChange={(e) => setFieldValue('name', e.target.value)}
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
                            {isSubmitting ? 'Saving...' : isEdit ? 'Update Stickers' : 'Create Stickers'}
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
        title="Remove Picture"
        subtitle={`Are you sure you want to remove picture.`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        showIcon={true}
        iconId="table-delete"
      />
    </>
  )
}

export default StickersForm
