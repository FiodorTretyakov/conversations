const fs = require('fs')

class Conversation {
  constructor (start) {
    this._routes = [start]
  }

  get currentId () {
    return this._routes[this._routes.length - 1]
  }

  get routes () {
    return this._routes
  }

  addRoute (r) {
    this._routes.push(r)
    return this
  };
}

let getChatsObject = (fileName) => JSON.parse(fs.readFileSync(fileName), 'UTF-8')

let toArray = (obj) => {
  let result = []

  for (let p in obj) {
    result.push(obj[p])
  }

  return result
}

let getPrefix = (fileName) => fileName.split('.')[0]

let isEndpoint = (c) => c.stage === 'endpoint'

let isStart = (c, prefix) => c.tag === prefix + '-start'

let isBye = (c) => c.tag === 'bye'

// if no start tag, it will throw unhandled exception, because of it is critical piece
let getStartChatId = (chats, prefix) => chats.find(c => isStart(c, prefix)).id

let getRoutesForward = (id, chats) => chats.find(c => c.id === id).routes.split('|')

let getRoutesBackward = (id, chats) => chats.filter(c => getRoutesForward(c.id, chats).some(r => r.id === id))

let traverse = (chats, id, isBackward) => {
  let stack = [new Conversation(id)]
  let result = []

  while (stack.length > 0) {
    let chat = stack.pop()

    let nextRoutes = (isBackward ? getRoutesBackward : getRoutesForward)(chat.currentId, chats)
    for (let c of chats.filter(c => chat.routes.every(cr => cr.id !== c.id) &&
            nextRoutes.some(cr => cr.id === c.id))) {
      chat.addRoute(c)

      if ((isBackward && isEndpoint(chats[c])) || (!isBackward && isBye(chats[c]))) {
        if (isBackward) {
          return true
        }

        result.push(chat.routes)
      } else {
        stack.push(chat)
      }
    };
  }

  return isBackward ? false : result
}

module.exports.getChatsObject = getChatsObject
module.exports.toArray = toArray
module.exports.getPrefix = getPrefix
module.exports.getStartChat = getStartChatId
module.exports.getRoutesForward = getRoutesForward
module.exports.getRoutesBackward = getRoutesBackward
module.exports.isEndpoint = isEndpoint
module.exports.isStart = isStart
module.exports.isBye = isBye
module.exports.traverse = traverse

module.exports.getAllRoutes = (fileName) => {
  let chats = toArray(getChatsObject(fileName))
  return traverse(chats, getStartChatId(chats, getPrefix(fileName)))
}

module.exports.isEndpointPassed = (fileName, id) => traverse(toArray(getChatsObject(fileName)), id, true)
