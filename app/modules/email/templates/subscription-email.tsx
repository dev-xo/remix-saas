import { render } from '@react-email/render'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Img,
  Preview,
  Text,
} from '@react-email/components'
import { sendEmail } from '#app/modules/email/email.server'

type SubscriptionEmailOptions = {
  email: string
  subscriptionId: string
}

/**
 * Templates.
 */
export function SubscriptionSuccessEmail({ email }: SubscriptionEmailOptions) {
  return (
    <Html>
      <Head />
      <Preview>Successfully Subscribed to PRO</Preview>
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
          <Text style={{ fontSize: '16px', lineHeight: '26px' }}>Hello {email}!</Text>
          <Text style={{ fontSize: '16px', lineHeight: '26px' }}>
            Your subscription to PRO has been successfully processed.
            <br />
            We hope you enjoy the new features!
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '26px' }}>
            The <Link href="http://localhost:3000">domain-name.com</Link> team.
          </Text>
          <Hr style={{ borderColor: '#cccccc', margin: '20px 0' }} />
          <Text style={{ color: '#8898aa', fontSize: '12px' }}>200 domain-name.com</Text>
        </Container>
      </Body>
    </Html>
  )
}

export function SubscriptionErrorEmail({ email }: SubscriptionEmailOptions) {
  return (
    <Html>
      <Head />
      <Preview>Subscription Issue - Customer Support</Preview>
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
          <Text style={{ fontSize: '16px', lineHeight: '26px' }}>Hello {email}.</Text>
          <Text style={{ fontSize: '16px', lineHeight: '26px' }}>
            We were unable to process your subscription to PRO tier.
            <br />
            But don't worry, we'll not charge you anything.
          </Text>
          <Text style={{ fontSize: '16px', lineHeight: '26px' }}>
            The <Link href="http://localhost:3000">domain-name.com</Link> team.
          </Text>
          <Hr style={{ borderColor: '#cccccc', margin: '20px 0' }} />
          <Text style={{ color: '#8898aa', fontSize: '12px' }}>200 domain-name.com</Text>
        </Container>
      </Body>
    </Html>
  )
}

/**
 * Renders.
 */
export function renderSubscriptionSuccessEmail(args: SubscriptionEmailOptions) {
  return render(<SubscriptionSuccessEmail {...args} />)
}

export function renderSubscriptionErrorEmail(args: SubscriptionEmailOptions) {
  return render(<SubscriptionErrorEmail {...args} />)
}

/**
 * Senders.
 */
export async function sendSubscriptionSuccessEmail({
  email,
  subscriptionId,
}: SubscriptionEmailOptions) {
  const html = renderSubscriptionSuccessEmail({ email, subscriptionId })

  await sendEmail({
    to: email,
    subject: 'Successfully Subscribed to PRO',
    html,
  })
}

export async function sendSubscriptionErrorEmail({
  email,
  subscriptionId,
}: SubscriptionEmailOptions) {
  const html = renderSubscriptionErrorEmail({ email, subscriptionId })

  await sendEmail({
    to: email,
    subject: 'Subscription Issue - Customer Support',
    html,
  })
}
