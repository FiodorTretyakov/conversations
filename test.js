const assert = require('assert')
const conversations = require('./conversations.js')

describe('conversations', function () {
  it('should read the file', function () {
    let chatObj = conversations.getChatsObject('test.json')

    assert(chatObj[1])
    assert(chatObj[2])
    assert(chatObj[1].id === '1')
    assert(chatObj[2].id === '2')
    assert(chatObj[1].text === 'Hi')
    assert(chatObj[2].text === 'Bye')
  })
  it('should convert to array', function () {
    let array = conversations.toArray(conversations.getChatsObject('test.json'))

    assert(array)
    assert(array.length === 2)
    assert(array[0].id === '1')
    assert(array[1].id === '2')
  })
  it('should get prefix', function () {
    let prefix = conversations.getPrefix('test.json')

    assert(prefix)
    assert(prefix === 'test')
  })
  it('should get start chat', function () {
    let start = conversations.getStartChat(conversations.toArray(conversations.getChatsObject('test.json')), 'test')

    assert(start)
    assert(start === '1')
  })
})
