'use client'

import { Card, Col, Row, Statistic, Table } from 'antd'

import { formatUTCDate } from '~/lib/date'


export default function SubscribersCard(props: {
  count: {
    today_count?: number
    total?: number
    this_month_count?: number
  }
  dataSource: any[]
}) {
  const { dataSource, count } = props
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: '订阅时间',
      dataIndex: 'subscribedAt',
      render: (date) => formatUTCDate(date),
    },
  ]
  return (
    <>
      <Row className="mt-6" gutter={16}>
        <Col span={8}>
          <Card>
            {count && 'total' in count && (
              <Statistic title="总订阅数" value={count.total} />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            {count && 'today_count' in count && (
              <Statistic
                title="今日订阅数"
                value={count.today_count}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            {count && 'this_month_count' in count && (
              <Statistic
                title="本月订阅数"
                value={count.this_month_count}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Card className="!mt-6" classNames={{ body: '!p-0' }}>
        <Table dataSource={dataSource} columns={columns} />
      </Card>
    </>
  )
}
