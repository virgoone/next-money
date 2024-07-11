import { NextResponse, type NextRequest } from 'next/server'

import { currentUser } from '@clerk/nextjs/server'
import { Ratelimit } from '@upstash/ratelimit'
import { z } from 'zod'

import { env } from '~/env.mjs'
import { redis } from '~/lib/redis'
import { S3Service } from '~/lib/s3'

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

function getKey(id: string) {
  return `s3:${id}`
}

type Params = { params: { key: string } }
const CreateS3StsSchema = z.object({
  md5: z.string(),
  fileType: z.string(),
  prefix: z.string().nullish().optional(),
})

export async function POST(req: NextRequest, { params }: Params) {
  const user = await currentUser()
  if (!user || !user.publicMetadata.siteOwner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { success } = await ratelimit.limit(
    getKey('s3-key') + `_${req.ip ?? ''}`,
  )
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
    })
  }

  try {
    const key = params.key
    const data = await req.json()
    const {
      md5,
      fileType,
      prefix = '/post/category/icon',
    } = CreateS3StsSchema.parse(data)

    const s3 = new S3Service({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
      url: env.S3_URL_BASE,
      bucket: env.S3_BUCKET,
    })

    const res = await s3.getSts(key, {
      path: prefix,
      acl: 'public-read',
      ContentType: fileType,
    })
    return NextResponse.json({ data: res })
  } catch (error) {
    console.log('error-->', error)
    return NextResponse.json({ error: '获取上传信息失败！' }, { status: 400 })
  }
}
