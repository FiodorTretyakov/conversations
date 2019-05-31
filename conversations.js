const fs = require('fs')

class Conversation {
  constructor (start) {
    this._route = [start]
  }

  get currentId () {
    return this._route[this._route.length - 1]
  }

  get route () {
    return this._route
  }

  addRoute (r) {
    this._route.push(r)
    return this
  };
}

let getChatsObject = (fileName) => JSON.parse(fs.readFileSync(fileName, 'utf8'))

let toArray = (obj) => {
  let result = []

  for (let p in obj) {
    result.push(obj[p])
  }

  return result
}

let getPrefix = (fileName) => fileName.split('.')[0]

// if no start tag, it will throw unhandled exception, because of it is critical piece
let getStartChat = (chats, prefix) => chats.find(c => isStart(c, prefix))

let getRoutesForward = (id, chats) => chats.find(c => c.id === id).routes.split('|')
let getRoutesBackward = (id, chats) => chats.filter(c => getRoutesForward(c.id, chats).some(r => r.id === id))

let isEndpoint = (c) => c.stage === 'endpoint'
let isStart = (c, prefix) => c.tag === prefix + '-start'
let isBye = (c) => c.tag === 'bye'

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

        result.push(chat.route)
      } else {
        stack.push(chat)
      }
    };
  }

  return isBackward ? false : result
}

module.exports.getAllRoutes = (fileName) => {
  let chats = toArray(getChatsObject(fileName))
  return traverse(chats, getStartChat(chats, getPrefix(fileName)))
}

module.exports.isEndpointPassed = (fileName, id) => traverse(toArray(getChatsObject(fileName)), id, true)
