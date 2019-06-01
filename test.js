const assert = require('assert')
const conversations = require('./conversations.js')

describe('conversations', function () {
  it('should read the file', function () {
    let chatObj = conversations.getChatsObject('test.json')

    assert(chatObj[1])
    assert(chatObj[2])
    assert(chatObj[3])
    assert.strictEqual('1', chatObj[1].id)
    assert.strictEqual('2', chatObj[2].id)
    assert.strictEqual('3', chatObj[3].id)
    assert.strictEqual('Hi', chatObj[1].text)
    assert.strictEqual('Bye', chatObj[2].text)
    assert.strictEqual('Wait', chatObj[3].text)
  })
  it('should convert to array', function () {
    let array = conversations.toArray(conversations.getChatsObject('test.json'))

    assert(array)
    assert.strictEqual(5, array.length)
    assert.strictEqual('1', array[0].id)
    assert.strictEqual('2', array[1].id)
    assert.strictEqual('3', array[2].id)
  })
  it('should get prefix', function () {
    let prefix = conversations.getPrefix('test.json')

    assert(prefix)
    assert.strictEqual('test', prefix)
  })
  it('should get start chat id', function () {
    let start = conversations.getStartChat(conversations.toArray(conversations.getChatsObject('test.json')), 'test')

    assert(start)
    assert.strictEqual('1', start)
  })
  it('should check is it endpoint', function () {
    assert(conversations.isEndpoint({ stage: 'endpoint' }))
    assert(!conversations.isEndpoint({ }))
  })
  it('should check is it start', function () {
    assert(conversations.isStart({ tag: 'test-start' }, 'test'))
    assert(!conversations.isStart({ }, ''))
  })
  it('should check is it bye', function () {
    assert(conversations.isBye({ tag: 'bye' }))
    assert(!conversations.isBye({ }))
  })
  it('should get routes forward', function () {
    let array = conversations.toArray(conversations.getChatsObject('test.json'))

    let routes3 = conversations.getRoutesForward('1', array)
    assert(routes3)
    assert.strictEqual(3, routes3.length)
    assert.strictEqual('2', routes3[0])
    assert.strictEqual('3', routes3[1])

    let routes1 = conversations.getRoutesForward('3', array)
    assert(routes1)
    assert.strictEqual(1, routes1.length)
    assert.strictEqual('5', routes1[0])
  })
  it('should get routes backward', function () {
    let array = conversations.toArray(conversations.getChatsObject('test.json'))

    let routes2 = conversations.getRoutesBackward('2', array)
    assert(routes2)
    assert.strictEqual(2, routes2.length)
    assert.strictEqual('1', routes2[0])
    assert.strictEqual('5', routes2[1])

    let routes1 = conversations.getRoutesBackward('3', array)
    assert(routes1)
    assert.strictEqual(1, routes1.length)
    assert.strictEqual('1', routes1[0])
  })
  it('should get routes', function () {
    let routes0 = conversations.getRoutes({ 'routes': '' })

    assert(routes0)
    assert(!routes0.length)

    let routes1 = conversations.getRoutes({ 'routes': '1' })

    assert(routes1)
    assert.strictEqual(1, routes1.length)

    let routes2 = conversations.getRoutes({ 'routes': '1|2' })

    assert(routes2)
    assert.strictEqual(2, routes2.length)
  })
  it('should traverse', function () {
    let chats = conversations.toArray(conversations.getChatsObject('test.json'))

    let forward = conversations.traverse(chats, '1')
    assert(forward)
    assert.strictEqual(4, forward.length)
    assert.strictEqual(JSON.stringify(['1', '2']), JSON.stringify(forward[0]))
    assert.strictEqual(JSON.stringify(['1', '4', '1', '2']), JSON.stringify(forward[1]))
    assert.strictEqual(JSON.stringify(['1', '4', '1', '3', '5', '2']), JSON.stringify(forward[2]))
    assert.strictEqual(JSON.stringify(['1', '3', '5', '2']), JSON.stringify(forward[3]))

    let backwardTrue = conversations.traverse(chats, '2', true)
    assert(backwardTrue)

    let backwardFalse = conversations.traverse(chats, '1', true)
    assert(!backwardFalse)
  })
})
