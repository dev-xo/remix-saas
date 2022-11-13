/**
 * Utils.
 */
export async function sendResetPasswordEmail({
	to,
	subject,
	htmlContent,
}: {
	to: [{ email: string }]
	subject: string
	htmlContent: string
}) {
	return fetch(`https://api.sendinblue.com/v3/smtp/email`, {
		method: 'post',
		body: JSON.stringify({
			sender: {
				name: 'Stripe Stack',
				email: 'localhost@mail.com',
			},
			to,
			subject,
			htmlContent,
		}),
		headers: {
			Accept: 'application/json',
			'Api-Key': process.env.EMAIL_PROVIDER_API_KEY,
			'Content-Type': 'application/json',
		},
	})
}
