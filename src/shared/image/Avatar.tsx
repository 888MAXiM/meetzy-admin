import { type FC, useState } from 'react'
import Image from './Image'
import { ImageBaseUrl } from '../../constants'
import type { AvatarProps } from '../../types/shared'
import { getInitials } from '../../utils'

const Avatar: FC<AvatarProps> = ({
  data,
  placeHolder,
  name,
  channel = false,
  customClass = '',
  height = 45,
  width = 45,
}) => {
  const [hasError, setHasError] = useState(false)
  const initials = getInitials(name?.name)
  const displayName = initials ? initials : name?.name || name?.first_name || ''
  const firstLetter = initials ? initials : displayName.charAt(0).toUpperCase()

  const renderInitial = () => (
    <div className={`profile ${customClass}`}>
      <span>{channel ? '#' : firstLetter}</span>
    </div>
  )

  const imageSrc = data?.avatar ? data?.avatar : ''

  if (!hasError && imageSrc) {
    return (
      <Image
        src={ImageBaseUrl + imageSrc}
        fallbackSrc={placeHolder}
        height={height}
        width={width}
        alt={displayName}
        onError={() => {
          setHasError(true)
        }}
        className={customClass}
      />
    )
  }

  return renderInitial()
}

export default Avatar
