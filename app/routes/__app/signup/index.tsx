import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader = async ({ request }: LoaderArgs) => {
	return redirect('/signup/email');
};

export default function SignupIndexRoute() {
	return <div>Whops! You should have been redirected.</div>;
}
