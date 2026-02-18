import { RiCloseLargeLine } from 'react-icons/ri'
import { Container, Input } from 'reactstrap'
import SvgIcon from '../../shared/icons/SvgIcon'
import { Image } from '../../shared/image'
import { getInitials } from '../../utils'
import type { EditUserProfileProps } from '../../types/profile'

const EditUserProfile: React.FC<EditUserProfileProps> = ({
  userData,
  avatarPreview,
  removeAvatar,
  hasAvatar,
  onAvatarChange,
  onRemoveAvatar,
}) => {
  return (
    <div className="profile-box">
      <div className="user-image">
        <div className="avatar position-relative">
          {avatarPreview && !removeAvatar ? (
            <Image src={avatarPreview} alt="Profile" className="img-fluid" />
          ) : (
            <div className="profile-placeholder">
              <span className="profile-placeholder-text">{getInitials(userData?.name || '')}</span>
            </div>
          )}
          <div className="user-img-upload position-relative">
            <Input type="file" id="user-avatar-upload" accept="image/*" onChange={onAvatarChange} hidden />
            {hasAvatar && (
              <button type="button" className="avatar-remove-btn" onClick={onRemoveAvatar} title="Remove image">
                <RiCloseLargeLine />
              </button>
            )}
          </div>
          <label htmlFor="user-avatar-upload" className="icon-wrapper cursor-pointer">
            <SvgIcon iconId={!userData?.avatar ? 'table-edit' : 'camera'} className="primary-fill-stroke" />
          </label>
        </div>
      </div>
      <div className="profile-data">
        <Container>
          <h5 className="profile-title">{userData?.name}</h5>
          <p className="contact-details mb-0">
            {userData?.email && (
              <>
                <SvgIcon iconId="sms" /> <span>{userData?.email}</span>
              </>
            )}
          </p>
        </Container>
      </div>
    </div>
  )
}

export default EditUserProfile
