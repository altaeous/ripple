import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { logout, pingUser } from '../helpers/Auth'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="nav">
        <h3>Ripple</h3>
        {pingUser() &&
          <>
            <Link to="/" className="[&.active]:font-bold">
              Dashboard
            </Link>
            <Link to="/login" className='[&.active]:font-bold' onClick={logout}>
              Logout
            </Link>
          </>
        }
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
