import { NextRequest, NextResponse } from 'next/server'

import { currentUser } from '@clerk/nextjs/server';


import { db } from '~/db'
import { MediaDto, MediaDtoSchema, MediaHashids } from '~/db/dto/media.dto'
import { media } from '~/db/schema'
import { ratelimit } from '~/lib/redis'

function getKey(id?: string) {
  return `s3${id ? `:${id}` : ''}`
}

const CreateMediaDtoSchema = MediaDtoSchema.omit({
  id: true,
  createdAt: true,
})

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user || !user.publicMetadata.siteOwner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { success } = await ratelimit.limit(getKey(user.id))
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
    })
  }

  try {
    const data = await req.json()

    const {
      name,
      key,
      url,
      color,
      blurhash,
      fileSize,
      fileType,
      md5,
      ext = {},
    } = CreateMediaDtoSchema.parse(data)

    const [newMedia] = await db
      .insert(media)
      .values({
        name,
        key,
        url,
        color,
        blurhash,
        fileSize,
        fileType,
        md5,
        ext,
      })
      .returning({
        newId: media.id,
      })

    return NextResponse.json(
      {
        id: MediaHashids.encode(newMedia.newId),
        createdAt: new Date(),
      } satisfies MediaDto,
      {
        status: 201,
      },
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
