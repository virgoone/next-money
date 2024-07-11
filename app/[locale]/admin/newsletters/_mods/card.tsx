'use client'

import { Button, Card, Col, Row, Statistic, Table } from 'antd'

import { formatUTCDate } from '~/lib/date'

export default function NewsLatterCard(props: {
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
      title: 'Subject',
      dataIndex: 'subject',
    },
    {
      title: 'Time',
      dataIndex: 'sentAt',
      render: (date) => formatUTCDate(date),
    },
  ]
  return (
    <>
      <Row className="mt-6" gutter={16}>
        <Col span={8}>
          <Card>
            {count && 'today_count' in count && (
              <Statistic title="Today Newsletters" value={count.today_count} />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            {count && 'this_month_count' in count && (
              <Statistic
                title="Month Newsletters"
                value={count.this_month_count}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            {count && 'total' in count && (
              <Statistic title="Total Newsletters" value={count.total} />
            )}
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="!mt-6" classNames={{ body: '!p-0' }}>
        <div className="flex justify-end mb-3 p-2">
          <Button type="primary" className='w-[160px]' href="newsletters/new">New</Button>
        </div>
        <Table dataSource={dataSource} columns={columns} />
      </Card>
    </>
  )
}
