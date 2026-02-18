import { useField, useFormikContext } from 'formik'
import { type FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SvgIcon from '../icons/SvgIcon'
import { Image } from '../image'
import type { MediaInputProps } from '../../types/shared'

const MediaInput: FC<MediaInputProps> = ({
  name,
  label,
  type = 'image',
  description,
  className = '',
  accept,
  size,
}) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)

  const [field, meta] = useField<string | File | null>(name)
  const { setFieldValue, setFieldTouched } = useFormikContext()

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    setFieldValue(name, file)
    setFieldTouched(name, true, false)
  }

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value
    setPreviewUrl(color)
    setFieldValue(name, color)
    setFieldTouched(name, true, false)
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    setFieldValue(name, null)
    setFieldTouched(name, true, false)
  }

  const renderPreview = () => {
    if (!previewUrl) return null

    if (type === 'color') {
      return <div className="color-preview" style={{ backgroundColor: previewUrl }} />
    }

    return type === 'video' ? (
      <video src={previewUrl} controls className="uploaded-media" />
    ) : (
      <Image src={previewUrl} alt={`${label} Preview`} className="uploaded-media" />
    )
  }

  const getAcceptTypes = () => {
    if (type === 'color') return undefined
    return accept || (type === 'video' ? 'video/*' : 'image/*')
  }

  const hasError = meta.touched && meta.error

  useEffect(() => {
    if (typeof field.value === 'string') {
      setPreviewUrl(field.value)
    } else if (!field.value) {
      setPreviewUrl(null)
    }
  }, [field.value])

  return (
    <div className={`settings-logo-upload ${className}`}>
      <div className="settings-logo-upload__item">
        <h6 className="settings-logo-upload__title">{t(label)}</h6>
        {description && <p className="settings-logo-upload__description">{description}</p>}

        <div className="settings-logo-upload__images d-flex gap-3">
          <div
            className={`upload-box ${hasError ? 'upload-box--error' : ''}`}
            onClick={() => (type === 'color' ? colorInputRef.current?.click() : fileInputRef.current?.click())}
          >
            <SvgIcon
              iconId={type === 'color' ? 'color' : 'upload-img'}
              className={`${type === 'color' ? 'mb-2 color-icon' : ''}`}
            />
            {type === 'color' ? (
              <input
                type="color"
                ref={colorInputRef}
                value={typeof field.value === 'string' ? field.value : '#000000'}
                onChange={handleColorChange}
              />
            ) : (
              <input type="file" hidden accept={getAcceptTypes()} ref={fileInputRef} onChange={handleUpload} />
            )}
          </div>

          {field.value && (
            <div className="upload-box has-image relative">
              {renderPreview()}
              <button
                className="upload-box__remove absolute top-1 right-1"
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
              >
                <SvgIcon iconId="close" />
              </button>
            </div>
          )}
        </div>

        {size && <p className="size-recommendation">Recommended size is {size}</p>}
        {hasError && <div className="settings-logo-upload__error">{meta.error}</div>}
      </div>
    </div>
  )
}

export default MediaInput
