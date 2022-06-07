import asap from '@architect/asap'
import arc from '@architect/functions'

const params = {
  cacheControl: 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
}
export const handler = arc.http.async(asap(params))
