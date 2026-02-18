import { Trash } from 'react-feather'
import { Button, Col, Label, Row } from 'reactstrap'
import { useState, useEffect } from 'react'
import { KeyValue } from '../../types/api'

interface CustomKeysSectionProps {
  values: { auth_type: string[]; body_fields?: KeyValue[] }
  setFieldValue: (field: string, value: any) => void
  onNewKeysChange?: (newKeys: KeyValue[]) => void
}

const CustomKeysSection = ({ values, onNewKeysChange }: CustomKeysSectionProps) => {
  const [newKeys, setNewKeys] = useState<KeyValue[]>([{ key: '', value: '' }])

  useEffect(() => {
    if (onNewKeysChange) {
      const validNewKeys = newKeys.filter((item) => item.key?.trim() !== '' && item.value?.trim() !== '')
      onNewKeysChange(validNewKeys)
    }
  }, [newKeys, onNewKeysChange])

  if (!values.auth_type.includes('CUSTOM_KEYS')) return null

  const handleAddField = () => {
    setNewKeys([...newKeys, { key: '', value: '' }])
  }

  const handleRemoveField = (index: number) => {
    if (newKeys.length <= 1) {
      setNewKeys([{ key: '', value: '' }])
      return
    }
    const updated = newKeys.filter((_, i) => i !== index)
    setNewKeys(updated)
  }

  const handleFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...newKeys]
    updated[index] = { ...updated[index], [field]: value }
    setNewKeys(updated)
  }

  return (
    <Col md="12">
      <Label>Custom Keys</Label>

      {newKeys.map((item, index) => (
        <Row key={index} className="align-items-center mb-2">
          <Col md={newKeys.length > 1 ? '5' : '6'}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Key"
              value={item.key || ''}
              onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
            />
          </Col>

          <Col md={newKeys.length > 1 ? '5' : '6'}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Value"
              value={item.value || ''}
              onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
            />
          </Col>

          <Col md="2">
            {newKeys.length > 1 && (
              <Button color="danger" onClick={() => handleRemoveField(index)}>
                <Trash size={20} />
              </Button>
            )}
          </Col>
        </Row>
      ))}

      <Button color="primary" onClick={handleAddField}>
        Add
      </Button>
    </Col>
  )
}

export default CustomKeysSection
