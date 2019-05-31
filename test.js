const assert = require('assert')
const conversations = require('./conversations.js')

describe('conversations', function () {
  it('should read the file', function () {
    let chatObj = conversations.getChatsObject('test.json')

    assert(chatObj[1])
    assert(chatObj[2])
    assert(chatObj[3])
    assert(chatObj[1].id === '1')
    assert(chatObj[2].id === '2')
    assert(chatObj[3].id === '3')
    assert(chatObj[1].text === 'Hi')
    assert(chatObj[2].text === 'Bye')
    assert(chatObj[3].text === 'Wait')
  })
  it('should convert to array', function () {
    let array = conversations.toArray(conversations.getChatsObject('test.json'))

    assert(array)
    assert(array.length === 3)
    assert(array[0].id === '1')
    assert(array[1].id === '2')
    assert(array[2].id === '3')
  })
  it('should get prefix', function () {
    let prefix = conversations.getPrefix('test.json')

    assert(prefix)
    assert(prefix === 'test')
  })
  it('should get start chat id', function () {
    let start = conversations.getStartChat(conversations.toArray(conversations.getChatsObject('test.json')), 'test')

    assert(start)
    assert(start === '1')
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

    let routes2 = conversations.getRoutesForward('1', array)
    assert(routes2)
    assert(routes2.length === 2)
    assert(routes2[0] === '2')
    assert(routes2[1] === '3')

    let routes1 = conversations.getRoutesForward('3', array)
    assert(routes1)
    assert(routes1.length === 1)
    assert(routes1[0] === '2')
  })
})
