'use client'

import { useCallback } from 'react'

import clsx from 'clsx'
import { Loader2, UploadCloud } from 'lucide-react'
import { Accept, useDropzone } from 'react-dropzone'

import { cn } from '@/lib/utils'

interface UploadProps {
  accept?: Accept
  className?: string
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  maxSize?: number
  maxFiles?: number
  placeholderText?: string | React.ReactNode
  onFileChange: (files: File[]) => void
  onDropRejected: () => void
}

const Upload = (props: UploadProps) => {
  const {
    loading = false,
    accept,
    disabled,
    placeholder = '请上传文件',
    placeholderText = '请拖拽或者点击上传文件',
    onDropRejected,
    onFileChange,
    className,
    maxSize,
    maxFiles,
  } = props
  const onFilePicked = useCallback(
    (files: any) => {
      if (!(files && files.length)) return
      onFileChange(files)
    },
    [onFileChange],
  )
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => onFilePicked(files),
    accept,
    maxSize,
    maxFiles,
    disabled: loading,
    onDropRejected,
  })

  return (
    <div
      {...getRootProps({
        className: cn(
          'relative overflow-hidden flex h-[225px] w-full flex-col items-center justify-center rounded-xl border-[1px] border-dashed border-gray-200 bg-gray-100 dark:!border-none dark:!bg-navy-700 max-w-full dropzone',
          className,
        ),
      })}
    >
      {loading && (
        <div
          className={clsx(
            'absolute z-10 flex h-full w-full flex-col items-center justify-center bg-white/[.66]',
          )}
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">{'Uploading...'}</p>
        </div>
      )}
      <p
        className={clsx('text-navy-700 text-[80px]', {
          'opacity-55': loading,
        })}
      >
        <UploadCloud />
      </p>
      <input
        type="file"
        placeholder={placeholder}
        disabled={disabled}
        {...getInputProps()}
        // {...field}
      />
      <p className="p-3 text-center text-sm text-gray-600">{placeholderText}</p>
    </div>
  )
}
export default Upload
