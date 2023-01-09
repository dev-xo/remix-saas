import type { SocialsProvider } from 'remix-auth-socials'
import { Form } from '@remix-run/react'

interface SocialFormProps {
	provider: SocialsProvider | string
	children: React.ReactNode
}

export function SocialForm({ provider, children }: SocialFormProps) {
	return (
		<Form action={`/auth/${provider}`} method="post">
			{children}
		</Form>
	)
}
