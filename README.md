# enhance-store
Single atom reactive data store.
Subscribe a function to be called when the data, or a specific key in the store is updated.

## Install
`npm i @enhance/store`

## Usage
Subscribe a function to be called anytime the store is updated
```javascript
import Store from '@enhance/store'

const store = Store({
  one: 1
})
const listener = data => {
  console.log(data.one)
}
store.subscribe(listener)
store.one = 2
```

Subscribe a function to be called anytime a specific key in the store is updated
```javascript
import Store from '@enhance/store'

const store = Store({
  one: 1,
  two: 2
})
const listener = data => {
  console.log(data.two)
}
store.subscribe(listener)
store.two = 3
```

Unsubscribe when updates are no longer needed
```javascript
import Store from '@enhance/store'

const store = Store({
  one: 1
})
const listener = data => {
  console.log(data.one)
}
store.subscribe(listener)
store.one = 2
// ...some time later
store.unsubscribe(listener)
```
> ⚠️ Most commonly you would subscribe & unsubscribe inside component lifecycle event handlers.
