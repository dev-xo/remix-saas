import { Outlet } from '@remix-run/react'
import { json } from '@remix-run/node'

export const ROUTE_PATH = '/' as const

export async function loader() {
  return json({})
}

export default function Home() {
  return <Outlet />
}
