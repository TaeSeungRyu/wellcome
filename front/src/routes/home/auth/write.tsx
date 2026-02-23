import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/auth/write')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/home/auth/write"!</div>
}
