import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = async ({ request }) => {
	return redirect('/signup/email');
};

export default function SignupIndexRoute() {
	return <div>Whops! You should have been redirected.</div>;
}
