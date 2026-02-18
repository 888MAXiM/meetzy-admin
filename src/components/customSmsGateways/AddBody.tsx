import { useEffect, useState } from 'react'
import { Trash } from 'react-feather'
import { Button, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap'
import CardWrapper from '../../shared/card/CardWrapper'
import { KeyValue } from '../../types/api'

export interface BodyKeyValue {
  key: string
  value: string
}

export interface BodyData {
  type: string
  jsonValue: string
  formData: KeyValue[]
  field_mappings?: KeyValue[]
}

interface AddBodyCardProps {
  initialBodyData?: BodyData
  onBodyDataChange?: (bodyData: BodyData) => void
}

const defaultBodyData: BodyData = {
  type: 'json',
  jsonValue: '',
  formData: [{ key: '', value: '' }],
  field_mappings: [],
}

const AddBody = ({ initialBodyData, onBodyDataChange }: AddBodyCardProps) => {
  const [activeTab, setActiveTab] = useState<'json' | 'formdata'>('json')
  const [bodyData, setBodyData] = useState<BodyData>(initialBodyData || defaultBodyData)

  useEffect(() => {
    if (initialBodyData) {
      const formDataToUse =
        initialBodyData.formData && initialBodyData.formData.length > 0
          ? initialBodyData.formData
          : [{ key: '', value: '' }]

      const initialData = {
        ...initialBodyData,
        formData: formDataToUse,
      }

      setBodyData(initialData)

      if (initialBodyData.type === 'formdata') {
        setActiveTab('formdata')
      } else if (initialBodyData.type === 'json') {
        setActiveTab('json')
      }
    }
  }, [initialBodyData])

  const handleBodyDataChange = (newBodyData: BodyData) => {
    setBodyData(newBodyData)
    onBodyDataChange?.(newBodyData)
  }

  const handleTabChange = (tab: 'json' | 'formdata') => {
    setActiveTab(tab)
    handleBodyDataChange({ ...bodyData, type: tab })
  }

  return (
    <Row>
      <Col xl="12">
        <CardWrapper
          heading={{
            title: 'Add Body',
          }}
        >
          <div>
            <Nav tabs className="nav-tabs-custom">
              <NavItem>
                <NavLink
                  className={activeTab === 'json' ? 'active' : ''}
                  onClick={() => handleTabChange('json')}
                  style={{ cursor: 'pointer' }}
                >
                  JSON
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={activeTab === 'formdata' ? 'active' : ''}
                  onClick={() => handleTabChange('formdata')}
                  style={{ cursor: 'pointer' }}
                >
                  Formdata
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab} className="mt-3">
              <TabPane tabId="json">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows={8}
                    value={bodyData.jsonValue}
                    onChange={(e) => handleBodyDataChange({ ...bodyData, jsonValue: e.target.value })}
                    placeholder="Enter JSON body"
                  />
                </div>
              </TabPane>

              <TabPane tabId="formdata">
                <div className="mb-3">
                  {bodyData.formData.length === 0 ? (
                    <p className="text-muted">No form data fields. Click "Add Field" to add one.</p>
                  ) : (
                    bodyData.formData.map((item, index) => (
                      <Row key={index} className="align-items-center mb-2">
                        <Col md={bodyData.formData.length > 1 ? '5' : '6'}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Key"
                            value={item.key || ''}
                            onChange={(e) => {
                              const newFormData = [...bodyData.formData]
                              newFormData[index] = { ...newFormData[index], key: e.target.value }
                              handleBodyDataChange({ ...bodyData, formData: newFormData })
                            }}
                          />
                        </Col>
                        <Col md={bodyData.formData.length > 1 ? '5' : '6'}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Value"
                            value={typeof item.value === 'string' ? item.value : String(item.value || '')}
                            onChange={(e) => {
                              const newFormData = [...bodyData.formData]
                              newFormData[index] = { ...newFormData[index], value: e.target.value }
                              handleBodyDataChange({ ...bodyData, formData: newFormData })
                            }}
                          />
                        </Col>
                        <Col md="2">
                          {bodyData.formData.length > 1 && (
                            <Button
                              color="danger"
                              onClick={() => {
                                const newFormData = bodyData.formData.filter((_, i) => i !== index)
                                handleBodyDataChange({ ...bodyData, formData: newFormData })
                              }}
                            >
                              <Trash size={20} />
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))
                  )}

                  <Button
                    color="primary"
                    onClick={() => {
                      const newFormData = [...bodyData.formData, { key: '', value: '' }]
                      handleBodyDataChange({ ...bodyData, formData: newFormData })
                    }}
                  >
                    Add Field
                  </Button>
                </div>
              </TabPane>
            </TabContent>
          </div>
        </CardWrapper>
      </Col>
    </Row>
  )
}

export default AddBody
