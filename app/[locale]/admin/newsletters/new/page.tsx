'use client'

import * as React from 'react'
import { redirect, useRouter } from 'next/navigation'

import { Button, Card, Form, Input, Space, type FormListFieldData } from 'antd'
import { toast } from 'sonner'

import useForm from '~/hooks/use-form'
import { getErrorMessage } from '~/lib/handle-error'

import { createAction } from './_lib/actions'
import { CreateNewsletterSchema, CreateSchema } from './_lib/validations'

const FormItem = Form.Item

export default function CreateNewsletterPage() {
  const [isCreatePending, startCreateTransition] = React.useTransition()
  const router = useRouter()
  function onSubmit(input: CreateSchema, error: FormListFieldData | null) {
    if (error) {
      const err = getErrorMessage(error)
      console.log('error-->', err)

      return toast.error(err + '')
    }
    startCreateTransition(() => {
      toast.promise(
        createAction({
          ...input,
        }),
        {
          loading: 'Creating...',
          success: () => {
            formField.form.resetFields()
            redirect('/admin/newsletters')
            return 'Created'
          },
          error: (error) => {
            return getErrorMessage(error)
          },
        },
      )
    })
  }
  const { formField, inputField } = useForm<CreateSchema>({
    schema: CreateNewsletterSchema,
    onSubmit,
  })

  return (
    <>
      <Card className="flex-1 overflow-auto" bordered={false}>
        <Form layout="vertical" {...formField}>
          <FormItem {...inputField} label="Title" name="subject">
            <Input />
          </FormItem>
          <FormItem {...inputField} label="Subject" name="body">
            <Input.TextArea
              rows={20}
              className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-zinc-100 dark:ring-zinc-700 sm:text-sm sm:leading-6"
              defaultValue={''}
            />
          </FormItem>
          <Space className="flex w-full justify-end gap-2 pt-2 sm:space-x-0">
            <Button
              type="default"
              onClick={() => {
                router.back()
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              disabled={isCreatePending}
              onClick={formField.form.submit}
            >
              Submit
            </Button>
          </Space>
        </Form>
      </Card>
    </>
  )
}
