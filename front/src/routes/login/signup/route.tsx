import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/login/signup"!</div>
}
