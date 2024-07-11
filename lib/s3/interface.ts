import { ObjectCannedACL } from '@aws-sdk/client-s3'

export interface IBucketS3Response {
  path: string
  pathWithFilename: string
  filename: string
  completedUrl: string
  baseUrl: string
  mime?: string
}

export interface IBucketS3MultipartParts {
  ETag?: string
  PartNumber?: number
}

export interface IBucketS3MultipartResponse {
  uploadId: string
  partNumber?: number
  maxPartNumber?: number
  parts?: IBucketS3MultipartParts[]
}

export interface IBucketS3PutItemOptions {
  path: string
  ContentType?: string
  acl?: ObjectCannedACL
}
