'use client'

import type { StatisticProps } from 'antd'
import { Card, Statistic } from 'antd'
import { Loader2 } from 'lucide-react'
import CountUp from 'react-countup'

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator="," />
)

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="h-4 w-4 text-muted-foreground"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
export default function StatisticsCard(props: {
  title: string
  subtitle?: string
  count: number
  icon?: React.ReactNode
  loading?: boolean
}) {
  const { loading, title, count, subtitle, icon } = props
  return (
    <Card bordered={false} loading={loading}>
      <Statistic
        title={title}
        value={count}
        precision={2}
        formatter={formatter}
        // valueStyle={{ color: '#3f8600' }}
        prefix={icon ? icon : <Icon />}
      />
    </Card>
  )
}