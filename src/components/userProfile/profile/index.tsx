import { useState } from 'react'
import { Col, Container, Row } from 'reactstrap'
import { queries } from '../../../api'
import CardWrapper from '../../../shared/card/CardWrapper'
import SvgIcon from '../../../shared/icons/SvgIcon'
import { SelectImage } from '../../../shared/image'
import { ConfirmModal } from '../../../shared/modal'
import { useSelectImage } from '../../../utils/hooks/useSelectImage'
import EditProfileForm from './EditProfile'

const Profile = () => {
  const { data: userData } = queries.useGetUserDetails()
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const {
    avatarPreview,
    removeAvatar,
    confirmRemoveMemberOpen,
    hasAvatar,
    setConfirmRemoveMemberOpen,
    confirmRemoveAvatar,
    onAvatarChange,
    onRemoveAvatar,
  } = useSelectImage({ name: userData?.user?.name, image: userData?.user?.avatar || '' })

  return (
    <>
      <Col xl="12">
        <CardWrapper
          heading={{
            title: 'profile',
            subtitle: 'view_and_control_user_access_and_permissions',
          }}
        >
          <Row>
            <Col md="4">
              <SelectImage
                name={userData?.user?.name}
                image={userData?.user?.avatar || previewImage}
                avatarPreview={avatarPreview}
                removeAvatar={removeAvatar}
                hasAvatar={hasAvatar}
                onAvatarChange={(e) => {
                  onAvatarChange(e)
                  const file = e.target.files?.[0]
                  if (!file) return

                  setProfileImageFile(file)

                  const reader = new FileReader()
                  reader.onload = () => {
                    if (reader.readyState === 2) {
                      setPreviewImage(reader.result as string)
                    }
                  }
                  reader.readAsDataURL(file)
                }}
                onRemoveAvatar={() => {
                  onRemoveAvatar()
                  setProfileImageFile(null)
                }}
                removeBtn={true}
              />
              <div className="profile-data">
                <Container>
                  <h5 className="profile-title">{userData?.user?.name}</h5>
                  <p className="contact-details mb-0">
                    {userData?.user?.email && (
                      <>
                        <SvgIcon iconId="sms" /> <span>{userData?.user?.email}</span>
                      </>
                    )}
                  </p>
                </Container>
              </div>
            </Col>

            <Col md="8">
              <EditProfileForm profileImageFile={profileImageFile} removeAvatar={removeAvatar} />
            </Col>
          </Row>
        </CardWrapper>
      </Col>
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

export default Profile
