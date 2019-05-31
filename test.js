const assert = require('assert')
const conversations = require('./conversations.js')

describe('conversations', function () {
  it('should reads the file', function () {
    let chatObj = conversations.getChatsObject('test.json')

    assert(chatObj[1])
    assert(chatObj[2])
    assert(chatObj[1].id === '1')
    assert(chatObj[2].id === '2')
    assert(chatObj[1].text === 'Hi')
    assert(chatObj[2].text === 'Bye')
  })
})
