import { Readable } from 'stream'
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  ObjectIdentifier,
  PutBucketCorsCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export interface IBucketS3PutItemOptions {
  path: string
  ContentType?: string
  acl?: ObjectCannedACL
}

export interface BucketS3Serialization {
  path: string

  pathWithFilename: string

  filename: string

  completedUrl: string

  baseUrl: string

  mime: string

  bucket?: string

  type?: string
}

export class S3Service {
  private endpoint: string
  private region: string
  private accessKeyId: string
  private secretAccessKey: string
  private s3Client: S3Client
  private bucket: string
  private url: string

  constructor(params: {
    endpoint: string
    region: string
    accessKeyId: string
    secretAccessKey: string
    url: string
    bucket?: string
  }) {
    this.endpoint = params.endpoint
    this.region = params.region
    this.accessKeyId = params.accessKeyId
    this.secretAccessKey = params.secretAccessKey
    this.bucket = params.bucket || 'private-oss'
    this.url = params.url
    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      forcePathStyle: true,
    })
  }

  async putItemInBucket(
    filename: string,
    content: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
    options?: IBucketS3PutItemOptions,
    bucket = this.bucket,
  ): Promise<BucketS3Serialization> {
    let path = options && options.path ? options.path : ''
    const acl = options && options.acl ? options.acl : 'public-read'

    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`

    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toLowerCase()
    const key: string = path ? `${path}/${filename}` : filename
    const putObjectOption: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: content,
      ACL: acl,
    }
    if (options?.ContentType) {
      putObjectOption.ContentType = options.ContentType
    }
    const command: PutObjectCommand = new PutObjectCommand(putObjectOption)

    await this.s3Client.send(command)

    return {
      path,
      pathWithFilename: key,
      filename: filename,
      completedUrl: `${this.url}/${key}`,
      baseUrl: this.url,
      mime,
      bucket,
      type: 'r2',
    }
  }
  async deleteItemInBucket(
    filename: string,
    bucket = this.bucket,
  ): Promise<void> {
    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: bucket,
      Key: filename,
    })

    try {
      await this.s3Client.send(command)
    } catch (e) {
      throw e
    }
  }

  async deleteItemsInBucket(
    filenames: string[],
    bucket = this.bucket,
  ): Promise<void> {
    const keys: ObjectIdentifier[] = filenames.map((val) => ({
      Key: val,
    }))
    const command: DeleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: keys,
      },
    })

    try {
      await this.s3Client.send(command)
    } catch (e) {
      throw e
    }
  }

  async deleteFolder(dir: string, bucket = this.bucket): Promise<void> {
    const commandList: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: dir,
    })
    const lists = await this.s3Client.send(commandList)

    try {
      const listItems = lists?.Contents?.map((val) => ({
        Key: val.Key,
      }))
      const commandDeleteItems: DeleteObjectsCommand = new DeleteObjectsCommand(
        {
          Bucket: bucket,
          Delete: {
            Objects: listItems,
          },
        },
      )

      await this.s3Client.send(commandDeleteItems)

      const commandDelete: DeleteObjectCommand = new DeleteObjectCommand({
        Bucket: bucket,
        Key: dir,
      })
      await this.s3Client.send(commandDelete)

      return
    } catch (e) {
      throw e
    }
  }

  async getSignedUrl(key: string, bucket = this.bucket, expiresIn = 7200) {
    const getCmd = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    const url = await getSignedUrl(this.s3Client, getCmd, {
      expiresIn,
    })

    return url
  }

  async getSts(
    filename: string,
    options?: IBucketS3PutItemOptions,
    bucket = this.bucket,
  ) {
    let path = options && options.path ? options.path : ''
    const acl = options && options.acl ? options.acl : 'public-read'

    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`

    const key: string = path ? `${path}/${filename}` : filename
    const putParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      ACL: acl,
    }
    // const response = await this.s3Client.send(
    //   new PutBucketCorsCommand({
    //     Bucket: bucket, //TODO: replace
    //     CORSConfiguration: {
    //       CORSRules: new Array({
    //         AllowedHeaders: ["Content-Type"], //this is important, do not use "*"
    //         AllowedMethods: ["GET", "PUT", "HEAD"],
    //         AllowedOrigins: ["*"],
    //         ExposeHeaders: [],
    //         MaxAgeSeconds: 3000,
    //       }),
    //     },
    //   })
    // );
    // console.dir(response)
    if (options?.ContentType) {
      putParams.ContentType = options?.ContentType
    }
    const putCmd = new PutObjectCommand(putParams)
    const getCmd = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    const putUrl = await getSignedUrl(this.s3Client, putCmd, {
      expiresIn: 60 * 60 * 2, // 2h
    })
    const getUrl = await getSignedUrl(this.s3Client, getCmd, {
      expiresIn: 7200,
    })

    const endpoint = this.endpoint

    return {
      putUrl: putUrl,
      url: getUrl,
      endpoint,
      completedUrl: `${this.url}/${key}`,
      key,
      bucket,
    }
  }
}
