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
import type { SingleWallpaper } from '../../types/api'
import type { FormValues } from '../../types/wallpaper'
import { useSelectImage } from '../../utils/hooks/useSelectImage'
import { useWallpaperFormHelpers, validationSchema } from './useWallpaperFormHelpers'
import EditWallpaperError from './EditWallpaperError'

const WallpaperForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const wallpaperData = location.state?.wallpaperData as SingleWallpaper | undefined
  const { handleSubmit } = useWallpaperFormHelpers()
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
  } = useSelectImage({ name: wallpaperData?.name, image: wallpaperData?.wallpaper })
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: '',
    wallpaper: '',
    statusSwitch: true,
  })
  useEffect(() => {
    if (isEdit && wallpaperData) {
      setInitialValues({
        name: wallpaperData.name,
        wallpaper: wallpaperData.wallpaper || '',
        statusSwitch: wallpaperData.status === true,
      })
    }
  }, [avatar, isEdit, wallpaperData])

  const handleCancel = () => {
    navigate(ROUTES.CHAT_WALLPAPERS)
  }

  if (isEdit && !wallpaperData) {
    return <EditWallpaperError />
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col xl="12">
            <CardWrapper
              heading={{
                title: isEdit ? 'edit_wallpaper' : 'add_new_wallpaper',
                subtitle: isEdit ? 'update_wallpaper_information' : 'create_a_new_frequently_asked_question',
              }}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  const submitValues = {
                    ...values,
                    wallpaper: avatar || values.wallpaper,
                  }
                  handleSubmit(submitValues, isEdit, avatar, id, navigate, setSubmitting, removeAvatar)
                }}
                enableReinitialize
              >
                {({ values, isSubmitting, setFieldValue, errors, touched }) => (
                  <Form>
                    <Row className="row">
                      <Col md="4" className="mb-3">
                        <SelectImage
                          name={wallpaperData?.name || 'W'}
                          image={wallpaperData?.wallpaper}
                          avatarPreview={avatarPreview}
                          removeAvatar={removeAvatar}
                          hasAvatar={hasAvatar}
                          onAvatarChange={(e) => {
                            onAvatarChange(e)
                            const file = e.target.files?.[0]
                            setFieldValue('wallpaper', file)
                          }}
                          onRemoveAvatar={() => {
                            onRemoveAvatar()
                            setFieldValue('wallpaper', null)
                          }}
                          removeBtn={true}
                        />
                        {touched.wallpaper && errors.wallpaper && (
                          <div className="text-danger small mt-1">{errors.wallpaper}</div>
                        )}
                      </Col>
                      <Col md="8" className="mb-3">
                        <Row>
                          <Col md="12">
                            <TextInput
                              name="name"
                              label="Name"
                              placeholder="Enter Wallpaper name"
                              value={values.name}
                              onChange={(e) => setFieldValue('name', e.target.value)}
                            />
                          </Col>

                          <Col md="6">
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
                            {isSubmitting ? 'Saving...' : isEdit ? 'Update Wallpaper' : 'Create Wallpaper'}
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
        title="Remove Profile Picture"
        subtitle={`Are you sure you want to remove profile picture.`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        showIcon={true}
        iconId="table-delete"
      />
    </>
  )
}

export default WallpaperForm
