export async function checkAuthentication(): Promise<boolean> {
  if (localStorage.getItem('server')) {
    try {
      new URL(localStorage.getItem('server') as string);
    } catch (e) {
      return false;
    }
  }

  if (!import.meta.env.VITE_CLIENT || !import.meta.env.VITE_SALT || !import.meta.env.VITE_VERSION) {
    alert('Please check your .env variables.'); // TODO replace this with something nicer
    localStorage.clear();
    window.location.href = '/login';
  }

  const isAuthenticated = await fetch(`${localStorage.getItem('server')}/rest/ping?u=${localStorage.getItem('username')}&t=${localStorage.getItem('token')}&c=${import.meta.env.VITE_CLIENT}&s=${import.meta.env.VITE_SALT}&v=${import.meta.env.VITE_VERSION}`).then(async res => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(await res.text(), 'text/xml');

    const error = xml.querySelector('error');
    if (error) {
      return false;
    }
    return true;
  }).catch(() => {
    return false;
  });
  return isAuthenticated;
}

export function pingUser(): boolean {
  return !!localStorage.getItem('server') && !!localStorage.getItem('username') && !!localStorage.getItem('token');
}

export const logout = (): void => {
  localStorage.clear();
  window.location.href = "/login";
}