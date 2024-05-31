import { createFileRoute } from '@tanstack/react-router'
import { checkAuthentication, pingUser } from '../helpers/Auth';

export const Route = createFileRoute('/')({
  loader: async () => {
    if (!pingUser() || !await checkAuthentication()) {
      localStorage.clear();
      window.location.href = "/login";
    }
  },
  component: () => <div>Hello /dashboard/!</div>
});