import Store from '@enhance/store'
const store = Store({
  account: {
    name: 'Damiam Groteske'
  }
})

export default function API() {
  return {
    store,
    subscribe: store.subscribe,
    unsubscribe: store.unsubscribe
  }
}
