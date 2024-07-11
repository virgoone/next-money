'use client'

import Link from 'next/link'

import { Card, Col, Row, Statistic, Table } from 'antd'

import { CommentDto } from '~/db/dto/comment.dto'
import { url } from '~/lib'
import { truncate } from '~/lib/string'

export default function CommentCard(props: {
  commentsCount: {
    today_count?: number
    total_count?: number
    this_month_count?: number
  }
  dataSource: CommentDto[]
  postMap: Map<string, any>
}) {
  const { dataSource, commentsCount, postMap } = props
  const columns = [
    {
      title: '文章',
      dataIndex: 'title',
      render: (title, row) => {
        return (
          <Link href={url(`/${postMap.get(row.postId)?.slug ?? ''}`).href}>
            {postMap.get(row.postId)?.title}
          </Link>
        )
      },
    },
    {
      title: '评论内容',
      dataIndex: 'body',
      render: (body) => truncate((body as any).text as string),
    },
  ]
  return (
    <>
      <Row className="mt-6" gutter={16}>
        <Col span={8}>
          <Card>
            {commentsCount && 'today_count' in commentsCount && (
              <Statistic title="今日评论数" value={commentsCount.today_count} />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            {commentsCount && 'this_month_count' in commentsCount && (
              <Statistic
                title="本月评论数"
                value={commentsCount.this_month_count}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            {commentsCount && 'total_count' in commentsCount && (
              <Statistic title="总评论数" value={commentsCount.total_count} />
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
