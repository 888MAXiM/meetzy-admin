import { Form, Formik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Col, Container, Label, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import { TextInput } from '../../shared/formFields'
import SearchableSelect from '../../shared/formFields/SearchableSelectInput'
import SvgIcon from '../../shared/icons/SvgIcon'
import { Image } from '../../shared/image'
import { ConfirmModal } from '../../shared/modal'
import { FormValues } from '../../types/announcement'
import { SelectOption } from '../../types/pages'
import { useSelectImage } from '../../utils/hooks/useSelectImage'
import { useAnnouncementsHelpers } from './useAnnouncementsHelpers'
import CardWrapper from '../../shared/card/CardWrapper'
import { Announcement } from '../../types/api'

const TYPE_OPTIONS: SelectOption[] = [
  { label: 'Get Started', value: 'get_started' },
  { label: 'Learn More', value: 'learn_more' },
  { label: 'None', value: 'none' },
]

const REDIRECT_URL: SelectOption[] = [
  { label: 'Chat', value: 'chat' },
  { label: 'Call', value: 'call' },
  { label: 'Status', value: 'status' },
  { label: 'Archive', value: 'archive' },
  { label: 'Notification', value: 'notification' },
  { label: 'Document', value: 'document' },
  { label: 'Friend Suggestions', value: 'friend-suggestions' },
  { label: 'Block', value: 'blockicon' },
  { label: 'Favorite', value: 'favorite' },
  { label: 'Settings', value: 'settings' },
]

const AnnouncementsForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const AnnounceData = location.state?.AnnounceData as Announcement
  const { handleSubmit } = useAnnouncementsHelpers()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState<string>()
  const [message, setMessage] = useState<string>()
  const [selectedType, setSelectedType] = useState<SelectOption | null>(TYPE_OPTIONS[2])
  const [redirectURLType, setRedirectURLType] = useState<SelectOption | null>(null)

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
    setPreviewUrl,
  } = useSelectImage({ name: AnnounceData?.title, image: AnnounceData?.file_url || undefined })

  const [initialValues, setInitialValues] = useState<FormValues>({
    title: '',
    message: '',
    additionalKey: '',
    link: '',
    media: '',
    redirectURL: '',
  })

  useEffect(() => {
    if (AnnounceData) {
      setInitialValues({
        title: AnnounceData.title,
        message: AnnounceData.content,
        media: AnnounceData.file_url || '',
        link: AnnounceData.action_link || '',
        additionalKey: AnnounceData.announcement_type,
        redirectURL: AnnounceData.metadata.redirect_url,
      })

      setTitle(AnnounceData.title)
      setMessage(AnnounceData.content)
      setPreviewUrl(AnnounceData.file_url)
      const exitedValue = TYPE_OPTIONS.find((item) => item.value === AnnounceData.announcement_type)
      setSelectedType(exitedValue || TYPE_OPTIONS[2])
      const exitedRedirectURL = REDIRECT_URL.find((item) => item.value === AnnounceData.metadata.redirect_url)
      setRedirectURLType(exitedRedirectURL || null)
    }
  }, [avatar, AnnounceData, setPreviewUrl])

  const handleCancel = () => {
    navigate(ROUTES.ANNOUNCEMENTS)
  }

  return (
    <>
      <Container fluid>
        <CardWrapper
          heading={{
            title: 'new_announce',
            subtitle: 'add_new_announce',
          }}
          backBtn
        >
          <Row className="px-2">
            <Col xs="6" className="announce-form-container">
              <Formik
                initialValues={initialValues}
                validate={(values) => {
                  const errors: Partial<FormValues> = {}
                  if (selectedType?.value === 'get_started' && !values.redirectURL) {
                    errors.redirectURL = 'Redirect URL is required for get_started announcements'
                  }
                  return errors
                }}
                onSubmit={(values, { setSubmitting }) => {
                  const submitValues = {
                    ...values,
                    media: avatar || values.media,
                  }
                  handleSubmit(submitValues, isEdit, avatar, id, navigate, setSubmitting, removeAvatar, AnnounceData)
                }}
                enableReinitialize
              >
                {({ values, isSubmitting, setFieldValue, errors, touched }) => (
                  <Form>
                    <Row>
                      <Col md="12">
                        <TextInput
                          name="title"
                          label="Title"
                          placeholder="Enter Message Title"
                          value={values.title}
                          onChange={(e) => {
                            setFieldValue('title', e.target.value)
                            setTitle(e.target.value)
                          }}
                        />
                      </Col>
                      <Col md="12">
                        <TextInput
                          name="message"
                          label="Message"
                          placeholder="Enter Message"
                          value={values.message}
                          onChange={(e) => {
                            setFieldValue('message', e.target.value)
                            setMessage(e.target.value)
                          }}
                        />
                      </Col>
                      <Col md="12" className="mb-3">
                        <Label>Additional Option</Label>
                        <SearchableSelect
                          name="additionalKey"
                          placeholder="Enter additional key"
                          options={TYPE_OPTIONS}
                          value={selectedType}
                          onChange={(option: SelectOption) => {
                            setSelectedType(option)
                            setFieldValue('additionalKey', option.value)
                            // Reset redirectURL when additional option changes away from get_started
                            if (option.value !== 'get_started') {
                              setRedirectURLType(null)
                              setFieldValue('redirectURL', '')
                            } else if (!isEdit) {
                              // Only reset to null when creating new announcement (not editing)
                              setRedirectURLType(null)
                              setFieldValue('redirectURL', '')
                            }
                          }}
                          isClearable={false}
                        />
                      </Col>
                      {selectedType?.value == 'get_started' && (
                        <Col md="12" className="mb-3">
                          <Label>
                            Redirect URL <span className="text-danger">*</span>
                          </Label>
                          <SearchableSelect
                            name="redirectURL"
                            placeholder="Select Redirect URL"
                            options={REDIRECT_URL}
                            value={redirectURLType}
                            onChange={(option: SelectOption) => {
                              setRedirectURLType(option)
                              setFieldValue('redirectURL', option?.value || '')
                            }}
                            isClearable={false}
                          />
                          {errors.redirectURL && touched.redirectURL && (
                            <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
                              {errors.redirectURL}
                            </div>
                          )}
                        </Col>
                      )}
                      {selectedType?.value == 'learn_more' && (
                        <Col md="12">
                          <TextInput
                            name="link"
                            label="Link"
                            placeholder="Enter Link"
                            value={values.link}
                            onChange={(e) => {
                              setFieldValue('link', e.target.value)
                            }}
                            required
                          />
                        </Col>
                      )}
                      <Col md="12">
                        <div className="settings-logo-upload border-0 p-0">
                          <Label>Media</Label>
                          <div className="settings-logo-upload__images d-flex gap-3">
                            <div className={`upload-box`} onClick={() => fileInputRef.current?.click()}>
                              <SvgIcon iconId="upload-img" />
                              <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                onChange={(e) => {
                                  onAvatarChange(e)
                                  const file = e.target.files?.[0]
                                  setFieldValue('media', file)
                                }}
                              />
                            </div>

                            {hasAvatar && avatarPreview && (
                              <div className="upload-box has-image relative">
                                <Image
                                  src={avatarPreview}
                                  alt="Preview"
                                  className="uploaded-media"
                                  onLoad={() => URL.revokeObjectURL(avatarPreview)}
                                />
                                <button
                                  className="upload-box__remove absolute top-1 right-1"
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onRemoveAvatar()
                                    setFieldValue('media', null)
                                  }}
                                >
                                  <SvgIcon iconId="close" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
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
                          {isSubmitting ? 'Saving...' : 'Send'}
                        </SolidButton>
                      </div>
                    </Col>
                  </Form>
                )}
              </Formik>
            </Col>
            <Col xs="6" className="pe-0">
              <div className="announce-preview-container">
                <div className="announce-preview-header">
                  <div className="announce-preview-profile">
                    <div className="announce-preview-avatar">A</div>
                    <div className="announce-preview-info">
                      <div className="announce-preview-name">Announcements</div>
                      <div className="announce-preview-subtitle">Official Announcements Account</div>
                    </div>
                  </div>
                </div>
                <div className="announce-main ">
                  <div className="announce-preview-card">
                    <div className="announce-preview-card-inner">
                      <div className="announce-preview-content">
                        <Image
                          src={avatarPreview || '/card-bg.png'}
                          alt="Status preview"
                          className="announce-preview-image"
                        />
                      </div>
                      {title ? (
                        <div className="announce-preview-card-title">{title}</div>
                      ) : (
                        <Skeleton count={1} width={100} />
                      )}
                      {message ? (
                        <div className="announce-preview-card-desc">{message}</div>
                      ) : (
                        <Skeleton count={5} width={200} />
                      )}
                      {selectedType?.value !== 'none' && (
                        <>
                          <hr />
                          <div className="d-flex justify-content-center">
                            <button className="announce-preview-card-btn">{selectedType?.label}</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </CardWrapper>
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

export default AnnouncementsForm
