import { Form, Formik, type FormikHelpers } from 'formik'
import { Col, Container, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import MediaInput from '../../shared/formFields/MediaInput'
import { toaster } from '../../utils/custom-functions'
import { yupObject } from '../../utils/validation-schemas'
import type { FrontendSettingsFormValues } from '../../types/settings'
import { useDispatch } from 'react-redux'
import { setSetting } from '../../redux/reducers/settingSlice'
import { useEffect } from 'react'

const FrontendSettings = () => {
  const { data } = queries.useGetSettings()
  const { mutate, isPending } = mutations.useUpdateSetting()
  const dispatch = useDispatch()

  const handleSubmit = (
    values: FrontendSettingsFormValues,
    { setSubmitting }: FormikHelpers<FrontendSettingsFormValues>,
  ) => {
    const formData = new FormData()

    const isFile = (val: unknown): val is File => val instanceof File

    Object.keys(values).forEach((key) => {
      const field = key as keyof FrontendSettingsFormValues
      const value = values[field]

      if (isFile(value)) {
        formData.append(field, value)
      } else if (value === null) {
        formData.append(field, 'null')
      } else if (value !== undefined) {
        formData.append(field, String(value))
      }
    })

    mutate(formData, {
      onSuccess: () => {
        toaster('success', 'Settings updated successfully')
      },
      onSettled: () => setSubmitting(false),
    })
  }

  useEffect(() => {
    if (data) {
      dispatch(setSetting(data))
    }
  }, [data, dispatch])

  const initialValues: FrontendSettingsFormValues = {
    logo_light: data?.settings?.logo_light_url || '',
    logo_dark: data?.settings?.logo_dark_url || '',
    sidebar_logo: data?.settings?.sidebar_logo_url || '',
    onboarding_logo: data?.settings?.onboarding_logo_url || '',
    landing_logo: data?.settings?.landing_logo_url || '',
    mobile_logo: data?.settings?.mobile_logo_url || '',
    favicon: data?.settings?.favicon_url || '',
    favicon_notification_logo: data?.settings?.favicon_notification_logo_url || '',
    maintenance_image: data?.settings?.maintenance_image_url || '',
    page_404_image: data?.settings?.page_404_image_url || '',
    no_internet_image: data?.settings?.no_internet_image_url || '',
    svg_color: data?.settings?.svg_color || '',
  }

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={yupObject({})} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Container fluid>
          <Row>
            <Col xl="12">
              <CardWrapper
                heading={{
                  title: 'frontend_settings',
                }}
              >
                <Form className="login-form" encType="multipart/form-data">
                  <Row>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="light_logo" name="logo_light" size="160px * 35px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="dark_logo" name="logo_dark" size="160px * 35px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="sidebar_logo_url" name="sidebar_logo" size="16px * 16px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="onboarding_logo_url" name="onboarding_logo" size="16px * 16px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="landing_logo_url" name="landing_logo" size="37px * 37px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="mobile_logo_url" name="mobile_logo" size="132px * 29px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="favicon_url" name="favicon" size="396px * 115px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput
                        label="favicon_notification_logo_url"
                        name="favicon_notification_logo"
                        size="396px * 115px"
                      />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="maintenance_image_url" name="maintenance_image" size="396px * 115px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="page_404_image_url" name="page_404_image" size="396px * 115px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="no_internet_image" name="no_internet_image" size="396px * 115px" />
                    </Col>
                    <Col md="6" lg="4" xxl="3">
                      <MediaInput label="svg_color" name="svg_color" type="color" />
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
export default FrontendSettings
