import type { SocialsProvider } from 'remix-auth-socials'
import { Form } from '@remix-run/react'

type ComponentProps = {
	provider: SocialsProvider | string
	className?: string
	children: React.ReactNode
}

export const SocialButton = ({
	provider,
	className,
	children,
}: ComponentProps) => {
	return (
		<Form action={`/auth/${provider}`} method="post">
			<button className={className}>{children}</button>
		</Form>
	)
}
