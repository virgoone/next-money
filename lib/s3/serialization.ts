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
