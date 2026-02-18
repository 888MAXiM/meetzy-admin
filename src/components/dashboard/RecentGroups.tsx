import { Card, CardBody, CardHeader, Col } from 'reactstrap'
import { queries } from '../../api'
import { Avatar } from '../../shared/image'
import CommonTable from '../../shared/table'
import type { SingleGroup } from '../../types/api'
import { COLUMN_TYPE } from '../../types/constants'
import type { Column, TableConfig } from '../../types/shared'
import { useTableManager } from '../../utils/hooks/useTablemanager'

const RecentGroups = () => {
  const { pagination: params } = useTableManager()
  const { data, isRefetching, isLoading } = queries.useGetGroups({
    ...params,
    limit: 4,
    sort: 'created_at',
    order: 'desc',
  })

  const columns: Column<SingleGroup>[] = [
    {
      title: 'Name',
      sortable: false,
      sortField: 'name',
      dataField: [
        {
          field: 'name',
          renderer: (data) => <p>{data?.name}</p>,
        },
      ],
    },
    {
      title: 'Creator',
      sortable: false,
      sortField: 'creator',
      dataField: [
        {
          field: 'creator',
          renderer: (data) => {
            return (
              <div className="user-content">
                <Avatar data={{ avatar: data?.avatar }} name={{ name: data?.name }} customClass="user-img" />
                <div className="text-start">
                  <h6 className="mb-0">{data?.name}</h6>
                  <p>{data?.email}</p>
                </div>
              </div>
            )
          },
        },
      ],
    },
    {
      title: 'Member Count',
      sortable: false,
      sortField: 'member_count',
      dataField: [
        {
          field: 'member_count',
          renderer: (data) => (
            <div className="d-flex align-items-center gap-2">
              <span>{data.member_count}</span>
            </div>
          ),
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

  const config: TableConfig<SingleGroup> = {
    columns,
    data: (data?.groups || []).slice(0, 4),
    actionsDropDown: [],
    total: Math.min(data?.total || 0, 4),
  }

  return (
    <Col xxl="6" xl="12" className="custom-order-12">
      <Card>
        <CardHeader className="border-0">
          <div className="header-top">
            <h4>Recent Groups</h4>
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

export default RecentGroups
