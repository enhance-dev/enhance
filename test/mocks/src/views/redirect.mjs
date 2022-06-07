export default function ({ redirect, url }) {
  return {
    status: redirect && redirect === 'permanent' ? 301 : 302,
    location: url
  }
}
