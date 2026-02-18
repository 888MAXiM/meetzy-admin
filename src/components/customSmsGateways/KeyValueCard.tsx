import { useState } from 'react'
import { Trash } from 'react-feather'
import { Button, Col, Row } from 'reactstrap'
import CardWrapper from '../../shared/card/CardWrapper'
import { KeyValue } from '../../types/api'

interface KeyValueCardProps {
  title: string
  initialData?: KeyValue[]
  onDataChange?: (data: KeyValue[]) => void
}

const KeyValueCard = ({ title, initialData = [], onDataChange }: KeyValueCardProps) => {
  const initialDataWithDefault = initialData.length > 0 ? initialData : [{ key: '', value: '' }]
  const [data, setData] = useState<KeyValue[]>(initialDataWithDefault)
  const handleDataChange = (newData: KeyValue[]) => {
    setData(newData)
    if (onDataChange) {
      onDataChange(newData)
    }
  }

  const handleAddField = () => {
    handleDataChange([...data, { key: '', value: '' }])
  }

  const handleRemoveField = (index: number) => {
    if (data.length <= 1) return
    const newData = data.filter((_, i) => i !== index)
    handleDataChange(newData)
  }

  const handleFieldChange = (index: number, field: 'key' | 'value', value: string) => {
    const newData = [...data]
    if (field === 'key') {
      newData[index] = { ...newData[index], key: value }
    } else {
      newData[index] = { ...newData[index], value }
    }
    handleDataChange(newData)
  }

  return (
    <CardWrapper
      heading={{
        title,
      }}
    >
      <div>
        <div className="mb-3">
          {data.map((item, index) => (
            <Row key={index} className="align-items-center mb-2">
              <Col md={data.length > 1 ? '5' : '6'}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Key"
                  value={item.key || ''}
                  onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                />
              </Col>
              <Col md={data.length > 1 ? '5' : '6'}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Value"
                  value={typeof item.value === 'string' ? item.value : String(item.value || '')}
                  onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                />
              </Col>
              <Col md="2">
                {data.length > 1 && (
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
        </div>
      </div>
    </CardWrapper>
  )
}

export default KeyValueCard
