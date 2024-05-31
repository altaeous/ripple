import { createFileRoute, redirect } from '@tanstack/react-router'
import React, { useState } from 'react'
import md5 from 'md5';
import { checkAuthentication, pingUser } from '../helpers/Auth';

export const Route = createFileRoute('/login')({
  loader: async () => {
    if (pingUser() && await checkAuthentication()) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Login />
})

function Login() {
  const [server, setServer] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [error, setError] = useState<{ code: string | undefined, message: string | undefined }>({ code: undefined, message: undefined });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError({ code: undefined, message: undefined });

    const token = md5(password + import.meta.env.VITE_SALT);

    fetch(`${server}/rest/getUser?u=${username}&t=${token}&c=${import.meta.env.VITE_CLIENT}&s=${import.meta.env.VITE_SALT}&v=${import.meta.env.VITE_VERSION}`, {
      method: 'POST'
    }).then(async res => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(await res.text(), 'text/xml');

      const error = xml.querySelector('error');

      if (error && error.attributes.getNamedItem('code')?.nodeValue && error.attributes.getNamedItem('message')?.nodeValue) {
        // Display error
        setError({ code: error.attributes.getNamedItem('code')?.nodeValue?.toString(), message: error.attributes.getNamedItem('message')?.nodeValue?.toString() });
      } else {
        // Set local storage
        localStorage.setItem('server', server);
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);

        // Redirect to homepage
        window.location.href = "/";
      }
    });
  }

  return (
    <div className="login">
      {!!error.code && !!error.message && <div className="login__error">{error.code}: {error.message}</div>}
      <form onSubmit={handleLogin}>
        <label htmlFor="server">Server</label>
        <input type="text" name="server" value={server} onChange={e => setServer(e.target.value)} required />
        <label htmlFor="username">Username</label>
        <input type="text" name="username" value={username} onChange={e => setUsername(e.target.value)} required />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}


