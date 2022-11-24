import type { SocialsProvider } from 'remix-auth-socials'
import { Form } from '@remix-run/react'

type ComponentProps = {
	provider: SocialsProvider | string
	children: React.ReactNode
}

export const SocialForm = ({ provider, children }: ComponentProps) => {
	return (
		<Form action={`/auth/${provider}`} method="post">
			{children}
		</Form>
	)
}
