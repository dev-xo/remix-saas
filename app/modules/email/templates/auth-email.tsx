import { render } from '@react-email/render'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Img,
  Button,
  Preview,
  Text,
} from '@react-email/components'
import { sendEmail } from '#app/modules/email/email.server'

type AuthEmailOptions = {
  email: string
  code: string
  magicLink?: string | null
}

/**
 * Templates.
 */
export function AuthEmail({ code, magicLink }: AuthEmailOptions) {
  return (
    <Html>
      <Head />
      <Preview>Your login code for Remix Auth TOTP</Preview>
      <Body
        style={{
          backgroundColor: '#ffffff',
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px' }}>
          <Img
            src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-logo.png"
            width="40"
            height="37"
            alt=""
          />
          <Heading
            style={{
              fontSize: '24px',
              letterSpacing: '-0.5px',
              lineHeight: '1.2',
              fontWeight: '400',
              color: '#484848',
              padding: '12px 0 0',
            }}>
            Your login code for Remix Auth TOTP
          </Heading>
          {magicLink && (
            <Section style={{ padding: '8px 0px' }}>
              <Button
                pY={11}
                pX={23}
                style={{
                  display: 'block',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  textAlign: 'center',
                  borderRadius: '3px',
                  backgroundColor: '#5e6ad2',
                }}
                href={magicLink}>
                Login to totp.fly
              </Button>
            </Section>
          )}
          <Text style={{ fontSize: '14px', lineHeight: '20px' }}>
            This link and code will only be valid for the next 60 seconds. If the link
            does not work, you can use the login verification code directly:
          </Text>
          <code
            style={{
              padding: '1px 4px',
              color: '#3c4149',
              fontFamily: 'sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '2px',
            }}>
            {code}
          </code>
          <Hr style={{ margin: '20px 0', borderColor: '#cccccc' }} />
          <Text style={{ color: '#8898aa', fontSize: '12px' }}>
            200 totp.fly.dev - Los Angeles, CA
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

/**
 * Renders.
 */
export function renderAuthEmailEmail(args: AuthEmailOptions) {
  return render(<AuthEmail {...args} />)
}

/**
 * Senders.
 */
export async function sendAuthEmail({ email, code, magicLink }: AuthEmailOptions) {
  const html = renderAuthEmailEmail({ email, code, magicLink })

  await sendEmail({
    to: email,
    subject: 'Your login code for Remix Auth TOTP',
    html,
  })
}
