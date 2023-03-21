import { useState } from 'react'

export default function Support() {
  const [displayMethods, setDisplayMethods] = useState(false)

  return (
    <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:h-full">
      {/* Avatar. */}
      <img
        src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/profile-avatar.png"
        alt="Avatar"
        className="h-40 w-40 select-none rounded-full transition hover:scale-105 hover:brightness-110"
      />
      <div className="my-3" />

      {/* Info. */}
      <div className="flex flex-col items-center">
        <h5 className="flex flex-row items-center text-center text-2xl font-bold text-gray-200">
          👋 Hello, I'm Daniel
        </h5>

        <span className="text-center font-semibold text-gray-400">
          I'm a Full Stack Developer from Spain.
        </span>
      </div>
      <div className="my-6" />

      {/* Support Methods. */}
      <p className="max-w-md text-center text-sm font-semibold text-gray-200">
        Would you like to support this template?
        <br /> You can do it by using any of the following crypto addresses:
      </p>
      <div className="my-3" />

      {displayMethods && (
        <>
          <div className="flex max-w-md flex-col items-center">
            <p className="max-w-sm text-xs font-semibold text-gray-400 hover:text-gray-200">
              <span className="font-bold text-violet-400">BTC:</span>{' '}
              bc1qew0jrlc8z29afrtftss2zsah6uw6harjyw8kg3
            </p>
            <div className="my-1" />
            <p className="max-w-sm text-xs font-semibold text-gray-400 hover:text-gray-200">
              <span className="font-bold text-violet-400">ETH:</span>{' '}
              D6nkNaFKfBFGS9UPmSkKXJ6EmJfUBND15a
            </p>
            <div className="my-1" />
            <p className="max-w-sm text-xs font-semibold text-gray-400 hover:text-gray-200">
              <span className="font-bold text-violet-400">DOGE:</span>{' '}
              0x83997E043Cf3983B4D90DC15df80f6004a1B3a26
            </p>
          </div>
          <div className="my-3" />
        </>
      )}

      <button
        onClick={() => setDisplayMethods(!displayMethods)}
        className="flex h-10 w-48 flex-row items-center justify-center rounded-xl border border-gray-600 px-4 font-bold
            text-gray-200 transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80">
        <button>{displayMethods ? 'Hide Methods' : 'Display Methods'}</button>
      </button>
    </div>
  )
}
