import test from 'tape'
import Store from './index.mjs'

test('store should exist', t => {
  t.ok(Store, 'store exists')
  t.end()
})

test('store should have a subscribe method', t => {
  t.ok(Store().subscribe, 'store has a subscribe method')
  t.end()
})

test('store should have an unsubscribe method', t => {
  t.ok(Store().unsubscribe, 'store has a subscribe method')
  t.end()
})

test('store should have an initialize method', t => {
  t.ok(Store().initialize, 'store has an initialize method')
  t.end()
})

test('store should accept initial state', t => {
  const store = Store({
    foo: 'bar'
  })
  t.equal(store.foo, 'bar', 'initial state is set')
  t.end()
})

test('store should update state', t => {
  const store = Store({
    foo: 'bar'
  })
  store.foo = 'baz'
  t.equal(store.foo, 'baz', 'state is set')
  store.foo = 'bar'
  t.equal(store.foo, 'bar', 'state is updated')
  t.end()
})

test('should subscibe to state updates', t => {
  const store = Store({
    one: 1
  })
  const listener = data => {
    t.equal(data.one, 2, 'state is updated')
    store.unsubscribe(listener)
    t.end()
  }
  store.subscribe(listener)
  store.one = 2
})

test('should subscribe to specific key state updates', t => {
  const store = Store({
    one: 1,
    two: 2
  })
  const listener = data => {
    t.ok(!data.one, 'one is not sent')
    t.equal(data.two, 3, 'state is updated')
    store.unsubscribe(listener)
    t.end()
  }
  store.subscribe(listener, ['two'])
  store.one = 2
  store.two = 3
})

test('should unsubscribe from state updates', t => {
  const store = Store({
    one: 1
  })
  const listener = data => {
    t.fail('Should not be called')
  }
  store.subscribe(listener)
  store.unsubscribe(listener)
  store.one = 2
  t.ok(true)
  t.end()
})

test('should not be called when not listening to specific key state updates', t => {
  t.plan(1)
  const store = Store({
    one: 1,
    two: 2
  })
  const listenerOne= data => {
    t.pass('I should be called')
  }
  const listenerTwo = data => {
    t.fail('I should not be called')
  }
  store.subscribe(listenerTwo, ['two'])
  store.subscribe(listenerOne, ['one'])
  store.one = 2

  t.teardown(() => {
    store.unsubscribe(listenerOne)
    store.unsubscribe(listenerTwo)
  })
})

test('should be able to subscribe private function for updates', t => {
  class MyPrivates {
    constructor() {
      this.store = Store({
        one: 1,
        two: 2
      })
      this.store.subscribe(this.#update, ['two'])
      this.store.one = 2
      this.store.two = 3
      // Wait a click
      setTimeout(() => this.store.unsubscribe(this.#update), 1)
    }

    #update(data) {
      t.ok(!data.one, 'one is not sent')
      t.equal(data.two, 3, 'state is updated')
      t.end()
    }
  }

  new MyPrivates()
})
