import { Form, Formik, useFormikContext } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import Select from 'react-select'
import { useField } from 'formik'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { ROUTES } from '../../constants'
import { usePlanFormHelpers } from '../../utils/hooks/planFormHelpers'
import { FormFeedback, FormGroup, Label } from 'reactstrap'
import { SinglePlan } from '../../types/api'
import { PlanFormValues } from '../../types/plans'
import { SwitchInput, TextArea, TextInput } from '../../shared/formFields'
import { plansValidationSchema } from '../../utils/validation-schemas'

const PlanForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const planData = location.state?.planData as SinglePlan | undefined
  const { handleSubmit } = usePlanFormHelpers()

  const [initialValues, setInitialValues] = useState<PlanFormValues>({
    name: '',
    slug: '',
    description: '',
    price_per_user_per_month: 0,
    price_per_user_per_year: '',
    billing_cycle: 'monthly',
    max_members_per_group: 10,
    max_members_per_broadcasts_list: 10,
    max_status: 10,
    max_broadcasts_list: 10,
    max_groups: 50,
    allows_file_sharing: true,
    video_calls_enabled: false,
    display_order: 0,
    is_default: false,
    statusSwitch: true,
  })

  useEffect(() => {
    if (isEdit && planData) {
      setInitialValues({
        name: planData.name || '',
        slug: planData.slug || '',
        description: planData.description || '',
        price_per_user_per_month: planData.price_per_user_per_month || 0,
        price_per_user_per_year: planData.price_per_user_per_year || '',
        billing_cycle: planData.billing_cycle || 'monthly',
        max_members_per_group: planData.max_members_per_group || 10,
        max_broadcasts_list: planData.max_broadcasts_list || 10,
        max_members_per_broadcasts_list: planData.max_members_per_broadcasts_list || 10,
        max_status: planData.max_status || 10,
        max_groups: planData.max_groups || 50,
        allows_file_sharing: planData.allows_file_sharing ?? true,
        video_calls_enabled: planData.video_calls_enabled ?? false,
        display_order: planData.display_order || 0,
        is_default: planData.is_default || false,
        statusSwitch: planData.status === 'active',
      })
    }
  }, [isEdit, planData])

  const handleCancel = () => {
    navigate(ROUTES.PLANS)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Component to auto-generate slug from name
  const SlugGenerator = ({ isEdit }: { isEdit: boolean }) => {
    const { values, setFieldValue } = useFormikContext<PlanFormValues>()
    const prevNameRef = useRef(values.name)

    useEffect(() => {
      if (!isEdit && values.name && values.name !== prevNameRef.current) {
        const slug = generateSlug(values.name)
        if (slug) {
          setFieldValue('slug', slug)
        }
        prevNameRef.current = values.name
      }
    }, [values.name, isEdit, setFieldValue])

    return null
  }

  if (isEdit && !planData) {
    return (
      <Container fluid>
        <Row>
          <Col xl="12">
            <CardWrapper
              heading={{
                title: 'edit_plan',
                subtitle: 'error_loading_plan',
              }}
            >
              <div className="text-center py-4">
                <div className="alert alert-warning">
                  <h5>Plan Data Not Available</h5>
                  <p>Unable to load plan details. Please go back and try editing again.</p>
                  <SolidButton className="btn-bg-secondary" onClick={() => navigate(ROUTES.PLANS)}>
                    Back to Plan List
                  </SolidButton>
                </div>
              </div>
            </CardWrapper>
          </Col>
        </Row>
      </Container>
    )
  }

  const BillingCycleSelect = ({ name }: { name: string }) => {
    const [field, meta, helpers] = useField(name)
    const options = [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
      { value: 'both', label: 'Both' },
    ]

    const selectedOption = options.find((opt) => opt.value === field.value)

    return (
      <FormGroup className="text-start">
        <Label for={name}>Billing Cycle</Label>
        <Select
          options={options}
          value={selectedOption}
          onChange={(option) => helpers.setValue(option?.value || 'monthly')}
          onBlur={() => helpers.setTouched(true)}
          classNamePrefix="react-select"
          placeholder="Select billing cycle"
        />
        {meta.touched && meta.error && <FormFeedback style={{ display: 'block' }}>{meta.error}</FormFeedback>}
      </FormGroup>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: isEdit ? 'edit_plan' : 'add_new_plan',
              subtitle: isEdit ? 'update_plan_information' : 'create_a_new_plan',
            }}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={plansValidationSchema}
              onSubmit={(values, { setSubmitting }) => handleSubmit(values, isEdit, id, navigate, setSubmitting)}
              enableReinitialize
            >
              {({ isSubmitting, setFieldValue }) => (
                <>
                  <SlugGenerator isEdit={isEdit} />
                  <Form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <TextInput name="name" label="Plan Name" placeholder="Enter plan name" />
                      </div>

                      <div className="col-md-6 mb-3">
                        <TextInput name="slug" label="Slug" placeholder="plan-slug" />
                      </div>

                      <div className="col-md-12 mb-3">
                        <TextArea
                          name="description"
                          label="Description"
                          placeholder="Enter plan description"
                          rows={4}
                        />
                      </div>

                      {/* Pricing Information */}
                      <div className="col-md-4 mb-3">
                        <TextInput
                          name="price_per_user_per_month"
                          label="Monthly Price (per user)"
                          placeholder="0.00"
                          onlyNumeric
                          allowDecimal
                        />
                      </div>

                      <div className="col-md-4 mb-3">
                        <TextInput
                          name="price_per_user_per_year"
                          label="Yearly Price (per user)"
                          placeholder="0.00"
                          onlyNumeric
                          allowDecimal
                        />
                      </div>

                      <div className="col-md-4 mb-3">
                        <BillingCycleSelect name="billing_cycle" />
                      </div>

                      {/* Usage Limits */}
                      <div className="col-md-4 mb-3">
                        <TextInput
                          name="max_members_per_group"
                          label="Max Members Per Group"
                          placeholder="10"
                          onlyNumeric
                        />
                      </div>

                      <div className="col-md-4 mb-3">
                        <TextInput name="max_broadcasts_list" label="Max Broadcasts List" onlyNumeric />
                      </div>

                      <div className="col-md-4 mb-3">
                        <TextInput name="max_groups" label="Max Groups" placeholder="50" onlyNumeric />
                      </div>

                      <div className="col-md-4 mb-3">
                        <TextInput
                          name="max_members_per_broadcasts_list"
                          label="Max Members/Broadcasts List"
                          onlyNumeric
                        />
                      </div>

                      <div className="col-md-4 mb-3">
                        <TextInput name="max_status" label="Max Status Per Day" onlyNumeric />
                      </div>

                      {/* Feature Flags */}
                      <div className="col-12 mb-3">
                        <h6 className="mb-3">Features</h6>
                      </div>

                      <div className="col-md-1 mb-3">
                        <SwitchInput name="allows_file_sharing" label="File Sharing" layout="horizontal" />
                      </div>

                      <div className="col-md-6 mb-3">
                        <SwitchInput name="video_calls_enabled" label="Video Calls" layout="horizontal" />
                      </div>

                      {/* Additional Settings */}
                      <div className="col-md-4 mb-3">
                        <TextInput name="display_order" label="Display Order" placeholder="0" onlyNumeric />
                      </div>

                      <div className="col-md-4 mb-3">
                        <SwitchInput name="is_default" label="Default Plan" layout="horizontal" />
                      </div>

                      <div className="col-md-6 mb-3">
                        <SwitchInput
                          name="statusSwitch"
                          label="Status"
                          layout="horizontal"
                          onToggle={(checked) => {
                            setFieldValue('statusSwitch', checked)
                          }}
                        />
                      </div>

                      <div className="col-12">
                        <div className="d-flex gap-2 justify-content-end">
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
                            {isSubmitting ? 'Saving...' : isEdit ? 'Update Plan' : 'Create Plan'}
                          </SolidButton>
                        </div>
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default PlanForm
