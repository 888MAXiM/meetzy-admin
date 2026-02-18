import { RiCloseLargeLine } from 'react-icons/ri'
import { Input } from 'reactstrap'
import SvgIcon from '../../shared/icons/SvgIcon'
import { Image } from '../../shared/image'
import type { SelectImageProps } from '../../types/shared'
import { getInitials } from '../../utils'

const SelectImage: React.FC<SelectImageProps> = ({
  name,
  image,
  avatarPreview,
  removeAvatar,
  hasAvatar,
  onAvatarChange,
  onRemoveAvatar,
  removeBtn = true,
}) => {
  return (
    <div className="profile-box">
      <div className="user-image">
        <div className="avatar position-relative">
          {avatarPreview && !removeAvatar ? (
            <Image src={avatarPreview} alt="Profile" className="img-fluid" />
          ) : (
            <div className="profile-placeholder">
              <span className="profile-placeholder-text">{getInitials(name || '')}</span>
            </div>
          )}
          <div className="user-img-upload position-relative">
            <Input type="file" id="image-upload" name="image" accept="image/*" onChange={onAvatarChange} hidden />
            {hasAvatar && removeBtn && (
              <button type="button" className="avatar-remove-btn" onClick={onRemoveAvatar} title="Remove image">
                <RiCloseLargeLine />
              </button>
            )}
          </div>
          <label htmlFor="image-upload" className="icon-wrapper cursor-pointer">
            <SvgIcon iconId={!avatarPreview ? 'table-edit' : 'camera'} />
          </label>
        </div>
      </div>
    </div>
  )
}

export default SelectImage
