import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="text-gray-300"></div>
      <h1 className="text-2xl text-gray-400">Not found</h1>
      <h2 className="text-lg text-gray-500">
        Whoops! Couldn&apos;t find what you looking for
      </h2>
      <Link
        href="/"
        className="py-4 text-sm text-gray-400 underline hover:text-gray-300"
      >
        Go back home
      </Link>
    </div>
  )
}
