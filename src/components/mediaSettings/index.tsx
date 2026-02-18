import { Form, Formik, type FormikHelpers } from 'formik'
import { Col, Container, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { TextInput } from '../../shared/formFields'
import TagInput from '../../shared/formFields/TagInput'
import type { MediaSettingsFormValues } from '../../types/settings'
import { toaster } from '../../utils/custom-functions'
import { yupObject } from '../../utils/validation-schemas'

const MediaSettings = () => {
  const { data } = queries.useGetSettings()
  const { mutate, isPending } = mutations.useUpdateSetting()

  const handleSubmit = (values: MediaSettingsFormValues, { setSubmitting }: FormikHelpers<MediaSettingsFormValues>) => {
    const formData = new FormData()

    const isFile = (val: unknown): val is File => val instanceof File

    Object.keys(values).forEach((key) => {
      const field = key as keyof MediaSettingsFormValues
      const value = values[field]

      if (isFile(value)) {
        formData.append(field, value)
      } else if (value === null) {
        formData.append(field, 'null')
      } else if (Array.isArray(value)) {
        formData.append(field, JSON.stringify(value))
      } else if (value !== undefined) {
        formData.append(field, String(value))
      }
    })

    mutate(formData, {
      onSuccess: () => toaster('success', 'Settings updated successfully'),
      onError: (error: any) => {
        toaster('error', error?.message)
      },

      onSettled: () => setSubmitting(false),
    })
  }

  const initialValues: MediaSettingsFormValues = {
    document_file_limit: data?.settings?.document_file_limit || '',
    audio_file_limit: data?.settings?.audio_file_limit || '',
    video_file_limit: data?.settings?.video_file_limit || '',
    image_file_limit: data?.settings?.image_file_limit || '',
    multiple_file_share_limit: data?.settings?.multiple_file_share_limit || '',
    maximum_message_length: data?.settings?.maximum_message_length || '',
    allowed_file_upload_types: data?.settings?.allowed_file_upload_types || [],
    call_timeout_seconds: data?.settings?.call_timeout_seconds || '',
    session_expiration_days: data?.settings?.session_expiration_days || '',
    status_expiry_time: data?.settings?.status_expiry_time || '',
    max_groups_per_user: data?.settings?.max_groups_per_user || '',
    max_group_members: data?.settings?.max_group_members || '',
  }

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={yupObject({})} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Container fluid>
          <Row>
            <Col xl="12">
              <CardWrapper
                heading={{
                  title: 'media_document_control',
                }}
              >
                <Form className="login-form" encType="multipart/form-data">
                  <Row>
                    <Col md="6">
                      <TextInput
                        name="document_file_limit"
                        label="document_file_limit"
                        placeholder="Enter document file limit"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="audio_file_limit"
                        label="audio_file_limit"
                        placeholder="Enter audio file limit"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="video_file_limit"
                        label="video_file_limit"
                        placeholder="Enter video file limit"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="image_file_limit"
                        label="image_file_limit"
                        placeholder="Enter image file limit"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="multiple_file_share_limit"
                        label="multiple_file_share_limit"
                        placeholder="Enter multiple file share limit"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="maximum_message_length"
                        label="maximum_message_length"
                        placeholder="Enter maximum message length"
                      />
                    </Col>
                    <Col md="6">
                      <TagInput
                        formGroupClass="margin-b-20"
                        name="allowed_file_upload_types"
                        placeholder="Enter allowed file upload types"
                        label="allowed_file_upload_types"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="call_timeout_seconds"
                        label="call_timeout_seconds"
                        placeholder="Enter call timeout seconds"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="status_expiry_time"
                        label="status_expiry_time"
                        placeholder="Enter status expiry time"
                        type="number"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="session_expiration_days"
                        label="session_expiration_days"
                        placeholder="Enter call timeout seconds"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="max_groups_per_user"
                        label="max_groups_per_user"
                        placeholder="Enter call timeout seconds"
                      />
                    </Col>
                    <Col md="6">
                      <TextInput
                        name="max_group_members"
                        label="max_group_members"
                        placeholder="Enter call timeout seconds"
                      />
                    </Col>
                  </Row>
                  <div className="form-actions">
                    <SolidButton loading={isPending || isSubmitting} color="primary" title="submit" type="submit" />
                  </div>
                </Form>
              </CardWrapper>
            </Col>
          </Row>
        </Container>
      )}
    </Formik>
  )
}
export default MediaSettings
