import Store from '@enhance/store'
const store = Store()

export default function API() {
  return {
    list: () => {
      store.things = ['one', 'two', 'three']
    },
    store,
    subscribe: store.subscribe,
    unsubscribe: store.unsubscribe
  }
}
