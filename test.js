const expect = require('chai').expect
const conversations = require('./conversations.js')

describe('conversations', function () {
  it('should reads the file', function () {
    let chats = conversations.getChatsObject('test.json')
    expect(chats.length).to.be.equal(2)
  })
})
