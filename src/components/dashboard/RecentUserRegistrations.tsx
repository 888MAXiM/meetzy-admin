import { Card, CardBody, CardHeader, Col } from 'reactstrap'
import { queries } from '../../api'
import { countryCodes } from '../../data/shared'
import { Avatar } from '../../shared/image'
import CommonTable from '../../shared/table'
import type { Column, TableConfig } from '../../types/shared'
import { useTableManager } from '../../utils/hooks/useTablemanager'
import type { SingleUser } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'

const RecentUserRegistrations = () => {
  const { pagination: params } = useTableManager()
  const { data, isRefetching, isLoading } = queries.useGetUsers({
    ...params,
    limit: 4,
    sort: 'created_at',
    order: 'desc',
  })

  const statusConfig: Record<SingleUser['status'], { class: string; label: string }> = {
    active: { class: 'text-success', label: 'Active' },
    pending: { class: 'text-warning', label: 'Pending' },
    blocked: { class: 'text-danger', label: 'Blocked' },
    deactivated: { class: 'text-secondary', label: 'Deactivated' },
  }

  const columns: Column<SingleUser>[] = [
    {
      title: 'name',
      sortable: false,
      sortField: 'name',
      dataField: [
        {
          field: 'name',
          renderer: (data) => (
            <div className="user-content">
              <Avatar data={data} name={data} customClass="user-img" />
              <div className="text-start">
                <h6 className="mb-0">{data?.name}</h6>
                <p>{data?.email}</p>
              </div>
            </div>
          ),
        },
      ],
    },

    {
      title: 'status',
      sortable: false,
      sortField: 'status',
      dataField: [
        {
          field: 'status',
          renderer: (data) => {
            const config = statusConfig[data?.status] || statusConfig.active
            return <span className={`fw-semibold ${config.class}`}>{config.label}</span>
          },
        },
      ],
    },
    {
      title: 'country',
      sortable: false,
      sortField: 'country_code',
      dataField: [
        {
          field: 'country_code',
          renderer: (data) => {
            const countryCode = data?.country_code
              ? data.country_code.startsWith('+')
                ? data.country_code
                : `+${data.country_code}`
              : undefined
            const country = countryCodes.find((c) => c.code === countryCode)
            return (
              <div className="d-flex align-items-center gap-2">
                {country ? (
                  <>
                    <img src={country.flag} alt={country.name} />
                    <span>{country.name}</span>
                  </>
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </div>
            )
          },
        },
      ],
    },
    {
      title: 'created_at',
      dataField: [
        {
          type: COLUMN_TYPE.Date,
          field: 'created_at',
          dateformatOptions: { showDate: true, showTime: false },
        },
      ],
    },
  ]

  const config: TableConfig<SingleUser> = {
    columns,
    data: (data?.users || []).slice(0, 4),
    actionsDropDown: [],
    total: Math.min(data?.total || 0, 4),
  }

  return (
    <Col md="6" className="custom-order-7">
      <Card>
        <CardHeader className="border-0">
          <div className="header-top">
            <h4>Recent User Registrations</h4>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <CommonTable
            className="recent-joined-table recent-table"
            isRefetching={isLoading || isRefetching}
            hasChecks={false}
            tableConfiguration={config}
          />
        </CardBody>
      </Card>
    </Col>
  )
}

export default RecentUserRegistrations
