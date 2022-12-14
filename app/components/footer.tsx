export function Footer() {
	return (
		<footer
			className="relative flex flex-row items-end justify-center
			bg-gradient-to-b from-[#0000] to-[rgba(77,29,149,0.6)]">
			<p className="absolute bottom-3 z-10 flex flex-row items-center text-sm font-semibold text-gray-400">
				Built by{' '}
				<a
					href="https://twitter.com/DanielKanem"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-row items-center text-gray-100 underline decoration-gray-500 transition
					hover:scale-105 hover:text-violet-200 hover:decoration-violet-200 hover:brightness-125 active:opacity-80">
					<img
						src="	https://pbs.twimg.com/profile_images/1598787429649027072/jZXBN47a_400x400.jpg"
						alt=""
						className="mx-2 max-h-6 select-none rounded-full drop-shadow-2xl"
					/>
					dev-xo
				</a>
				. Hosted on Fly.io
			</p>

			<img
				src="	https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/mona.png"
				alt=""
				className="max-h-44 max-w-[50%] select-none drop-shadow-2xl"
			/>
		</footer>
	)
}
