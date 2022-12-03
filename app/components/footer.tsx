export function Footer() {
	return (
		<footer
			className="relative flex flex-row items-end justify-center
			bg-gradient-to-b from-[#0000] to-[rgba(77,29,149,0.6)]">
			<p className="absolute bottom-3 z-10 font-semibold text-gray-400">
				Built by{' '}
				<a
					href="https://twitter.com/DanielKanem"
					target="_blank"
					rel="noopener noreferrer"
					className="text-gray-100 underline decoration-gray-500 transition 
					hover:text-violet-200 hover:decoration-violet-200 active:opacity-80">
					dev-xo
				</a>
				. Hosted on Fly.io
			</p>

			<img
				src="	https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/mona.png"
				alt=""
				className="max-h-44 max-w-[50%] cursor-default select-none drop-shadow-2xl transition hover:brightness-125"
			/>
		</footer>
	)
}
