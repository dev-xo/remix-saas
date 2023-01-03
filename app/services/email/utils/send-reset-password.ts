import { sendEmail } from '~/services/email/api/send-email.server'

export async function sendResetPasswordEmail({
	to,
	resetPasswordUrl,
}: {
	to: [{ email: string }]
	resetPasswordUrl: string | URL
}) {
	const sender = {
		name: 'Stripe Stack',
		email: 'stripe-stack@localhost.com',
	}
	const subject = `Stripe Stack - Reset your password.`
	const htmlContent = `
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
			</head>
			<body>
				<h1>Reset your Stripe Stack password.</h1>
				<a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
			</body>
		</html>`

	return await sendEmail({ sender, to, subject, htmlContent })
}
