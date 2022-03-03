const _state = {}
const dirtyProps = []
const listeners = []
const inWindow = typeof window != 'undefined'
const set = inWindow
  ? window.requestAnimationFrame
  : setTimeout
const cancel = inWindow
  ? window.cancelAnimationFrame
  : clearTimeout
let timeout
const handler = {
  set: function (obj, prop, value) {
    if (prop === 'initialize' ||
        prop === 'subscribe' ||
        prop === 'unsubscribe') {
      return false
    }
    let oldValue = obj[prop]
    if (oldValue !== value) {
      obj[prop] = value
      dirtyProps.push(prop)
      timeout && cancel(timeout)
      timeout = set(notify)
    }

    return true
  }
}

_state.initialize = initialize
_state.subscribe = subscribe
_state.unsubscribe = unsubscribe
const store = new Proxy(_state, handler)

export default function Store(initialState) {
  if (initialState) {
    initialize(initialState)
  }
  return store
}

function merge (o, n) {
  for (let prop in n) {
    o[prop] = n[prop]
  }
}

/**
 * Function for initializing store with existing data
 * @param {object} initialState - object to be merged with internal state
 */
function initialize(initialState) {
  if (initialState) {
    merge(_state, initialState)
  }
}

/**
 * Function for subscribing to state updates.
 * @param {function} fn - function to be called when state changes
 * @param {array} props - list props to listen to for changes
 * @return {number} returns current number of listeners
 */
function subscribe(fn, props) {
  fn.observedProperties = props || []
  return listeners.push(fn)
}

/**
 * Function for unsubscribing from state updates.
 * @param {function} fn - function to unsubscribe from state updates
 *
 */
function unsubscribe(fn) {
  return listeners.splice(listeners.indexOf(fn), 1)
}

function notify() {
  listeners.forEach(fn => {
    const props = fn.observedProperties
    const payload = props.length
      ? dirtyProps
        .filter(key => props.includes(key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: _state[key]
          }
        }, {})
      : { ..._state }
    fn(payload)
  })
  dirtyProps.length = 0
}