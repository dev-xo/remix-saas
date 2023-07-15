export type SendEmailBody = {
  sender: {
    name: string
    email: string
  }
  to: {
    name?: string
    email: string
  }[]
  subject: string
  htmlContent: string
}

export const sendEmail = async (body: SendEmailBody) => {
  try {
    return fetch(`https://api.sendinblue.com/v3/smtp/email`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Api-Key': process.env.EMAIL_PROVIDER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...body }),
    })
  } catch (err: unknown) {
    console.log(err)
    return false
  }
}
