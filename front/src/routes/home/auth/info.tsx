import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/auth/info')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/home/auth/info"!</div>
}
