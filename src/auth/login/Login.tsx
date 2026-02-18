import { Table } from 'reactstrap'

interface LoginTableProps {
  setFieldValue: (field: string, value: any) => void
}

const LoginTable = ({ setFieldValue }: LoginTableProps) => {
  const handleCopy = (identifier: string, password: string) => {
    navigator.clipboard.writeText(`${identifier} | ${password}`)

    setFieldValue('identifier', identifier)
    setFieldValue('password', password)
  }

  return (
    <Table bordered hover responsive className="mb-0 mt-3 login-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Password</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>admin@example.com</td>
          <td>123456789</td>
          <td>
            <span
              className="text-primary"
              style={{ cursor: 'pointer' }}
              onClick={() => handleCopy('admin@example.com', '123456789')}
            >
              copy
            </span>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default LoginTable
