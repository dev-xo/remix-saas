export function Footer() {
	return (
		<footer
			className="z-10 m-auto my-0 flex max-h-[80px] min-h-[80px] 
			w-full flex-row items-center justify-center">
			<p className="flex flex-row items-center text-sm font-semibold text-gray-400">
				Created by{' '}
				<a
					href="https://twitter.com/DanielKanem"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-row items-center text-gray-100 underline decoration-gray-500 transition
					hover:scale-105 hover:text-violet-200 hover:decoration-violet-200 hover:brightness-125 active:opacity-80">
					<img
						src="	https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/profile-avatar.jpg"
						alt=""
						className="mx-2 max-h-6 select-none rounded-full"
					/>
					dev-xo
				</a>
				{/* Divider. */}
				<span className="mx-6 h-5 w-px bg-gray-800"></span>
				Hosted on Fly.io
			</p>
		</footer>
	)
}
