import quantize from '@lokesh.dhakar/quantize/dist/index.mjs'
import { encode } from 'blurhash'
import SparkMD5 from 'spark-md5'

import { createPixelArray } from '../color'

const _self: any = self

interface Data {
  payload: Payload
  id: string
}

export interface ExifType {
  width?: number
  height?: number
  color?: number[]
  blurhash: string
  md5?: string
}

export const getImageData = (image: any) => {
  const canvas = new OffscreenCanvas(100, 1)
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext('2d')
  if (!context) {
    return null
  }
  context.drawImage(image, 0, 0, image.width, image.height)
  return context.getImageData(0, 0, image.width, image.height)
}
export function getExifInfo(
  blob: Blob,
  quality = 10,
  getBlurHash = true,
): Promise<ExifType> {
  return new Promise(async (resolve, reject) => {
    try {
      const image = await createImageBitmap(blob)
      const imageData = getImageData(image)
      if (!imageData) {
        reject(new Error('获取图片信息错误'))
        return
      }
      let blurhash = ''
      if (getBlurHash) {
        blurhash = encode(
          imageData.data,
          imageData.width,
          imageData.height,
          4,
          4,
        )
      }
      const pixelCount = image.width * image.height

      const pixelArray = createPixelArray(imageData.data, pixelCount, quality)
      const cmap = quantize(pixelArray, 5)
      const palette = cmap ? cmap.palette() : null
      const color = palette?.[0]
      resolve({
        blurhash,
        color: Array.isArray(color) ? `rgb(${color.join(',')})` : color,
        width: imageData.width,
        height: imageData.height,
      })
    } catch (error) {
      reject(error)
    }
  })
}
interface Payload {
  threshold?: number
  input?: any
  output?: ExifType
  name?: string
  type?: string
  quality?: number
  blurHash?: boolean
}
const spark = new SparkMD5.ArrayBuffer()

_self.onmessage = async ({ data: { id, payload } }: { data: Data }) => {
  try {
    spark.append(payload.input)
    const md5 = spark.end()

    let exitInfo = {}
    const { quality = 10, blurHash = true, type } = payload || {}

    if (type?.startsWith('image') && !type.includes('svg')) {
      const { blurhash, width, height, color } = await getExifInfo(
        new Blob([payload.input], { type }),
        quality,
        blurHash,
      )
      exitInfo = {
        blurhash,
        width,
        height,
        color,
      }
    }

    _self.postMessage({
      id,
      payload: {
        output: {
          ...exitInfo,
          md5,
        },
      },
    })
  } catch (e) {
    _self.postMessage({
      id,
      err: e.message,
    })
  }
}
