import { Formik, Form as FormikForm } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { PhoneInput, TextInput } from '../../shared/formFields'
import { ConfirmModal } from '../../shared/modal'
import { nameSchema, yupObject } from '../../utils/validation-schemas'
import EditUserProfile from './EditUserProfile'
import { useEditUser } from './useEditUser'
import { useEditUserHelper } from './useEditUserHelper'

const EditUser = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { handleSubmit } = useEditUserHelper()

  const {
    userData,
    initialValues,
    avatarPreview,
    removeAvatar,
    confirmRemoveMemberOpen,
    avatar,
    hasAvatar,
    setConfirmRemoveMemberOpen,
    confirmRemoveAvatar,
    onAvatarChange,
    onRemoveAvatar,
  } = useEditUser()

  return (
    <>
      <Container fluid>
        <Row>
          <Col xl="12">
            <CardWrapper
              heading={{
                title: t('edit_user'),
                subtitle: t('edit_details_of_user'),
              }}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={yupObject({
                  first_name: nameSchema(t('first_name')),
                  last_name: nameSchema(t('last_name')).optional(),
                  email: nameSchema(t('email')).optional(),
                  password: nameSchema(t('password')).optional(),
                })}
                onSubmit={(values, helpers) => handleSubmit(values, userData, avatar, removeAvatar, navigate, helpers)}
                enableReinitialize
              >
                {() => {
                  return (
                    <FormikForm className="login-form custom-field">
                      <Row>
                        <Col lg="4">
                          <EditUserProfile
                            userData={userData}
                            avatarPreview={avatarPreview}
                            removeAvatar={removeAvatar}
                            hasAvatar={hasAvatar}
                            onAvatarChange={onAvatarChange}
                            onRemoveAvatar={onRemoveAvatar}
                          />
                        </Col>
                        <Col lg="8">
                          <Row>
                            <Col lg="6">
                              <TextInput
                                layout="vertical"
                                className="custom-input"
                                formGroupClass="margin-b-25"
                                label={t('first_name')}
                                name="first_name"
                                labelClass="margin-b-10"
                                placeholder={t('enter_firstname')}
                                required
                              />
                            </Col>
                            <Col lg="6">
                              <TextInput
                                layout="vertical"
                                className="custom-input"
                                formGroupClass="margin-b-25"
                                label={t('last_name')}
                                name="last_name"
                                labelClass="margin-b-10"
                                placeholder={t('enter_lastname')}
                              />
                            </Col>
                            <Col xxl="6" xl="8">
                              <PhoneInput
                                xxlClass={4}
                                xxlClass2={8}
                                user={userData}
                                codeName="country_code"
                                name="phone"
                                label={t('phone')}
                              />
                            </Col>
                            {!userData && (
                              <>
                                <Col xxl="6" xl="8">
                                  <TextInput name="email" label={t('email')} placeholder={t('enter_email')} />
                                </Col>
                                <Col xxl="6" xl="8">
                                  <TextInput name="password" label={t('password')} placeholder={t('enter_password')} />
                                </Col>
                              </>
                            )}
                          </Row>
                        </Col>
                      </Row>

                      <div className="form-actions mt-3">
                        <SolidButton
                          title="cancel"
                          color="outline-light"
                          type="button"
                          onClick={() => navigate(ROUTES.USERS)}
                        />
                        <SolidButton
                          title={userData ? 'Update' : 'Submit'}
                          type="submit"
                          color="primary"
                          className="btn btn-primary"
                        />
                      </div>
                    </FormikForm>
                  )
                }}
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

export default EditUser
