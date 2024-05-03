import type { ActionFunctionArgs } from '@remix-run/router'
import {
  json,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  MaxPartSizeExceededError,
} from '@remix-run/node'
import { z } from 'zod'
import { parseWithZod } from '@conform-to/zod'
import { type SubmissionResult } from '@conform-to/react'
import { requireUser } from '#app/modules/auth/auth.server'
import { prisma } from '#app/utils/db.server.js'
import { createToastHeaders } from '#app/utils/toast.server'

export const ROUTE_PATH = '/resources/upload-image' as const
export const MAX_FILE_SIZE = 1024 * 1024 * 3 // 3MB

export const ImageSchema = z.object({
  imageFile: z.instanceof(File).refine((file) => file.size > 0, 'Image is required.'),
})

export async function action({ request }: ActionFunctionArgs) {
  try {
    const user = await requireUser(request)

    const formData = await unstable_parseMultipartFormData(
      request,
      unstable_createMemoryUploadHandler({ maxPartSize: MAX_FILE_SIZE }),
    )
    const submission = await parseWithZod(formData, {
      schema: ImageSchema.transform(async (data) => {
        return {
          image: {
            contentType: data.imageFile.type,
            blob: Buffer.from(await data.imageFile.arrayBuffer()),
          },
        }
      }),
      async: true,
    })
    if (submission.status !== 'success') {
      return json(submission.reply(), {
        status: submission.status === 'error' ? 400 : 200,
      })
    }

    const { image } = submission.value
    await prisma.$transaction(async ($prisma) => {
      await $prisma.userImage.deleteMany({ where: { userId: user.id } })
      await $prisma.user.update({
        where: { id: user.id },
        data: { image: { create: image } },
      })
    })

    return json(submission.reply({ fieldErrors: {} }), {
      headers: await createToastHeaders({
        title: 'Success!',
        description: 'Image uploaded successfully.',
      }),
    })
  } catch (error: unknown) {
    if (error instanceof MaxPartSizeExceededError) {
      const result: SubmissionResult = {
        initialValue: {},
        status: 'error',
        error: {
          imageFile: ['Image size must be less than 3MB.'],
        },
        state: {
          validated: {
            imageFile: true,
          },
        },
      }
      return json(result, { status: 400 })
    } else throw error
  }
}
