const fs = require('fs')

class Conversation {
  constructor (r) {
    this._routes = r
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

let getRoutes = (chat) => chat.routes.split('|')

let getRoutesForward = (id, chats) => getRoutes(chats.find(c => c.id === id))

let getRoutesBackward = (id, chats) => chats.filter(c => getRoutes(c).some(r => r === id)).map(c => c.id)

let traverse = (chats, id, isBackward) => {
  let stack = [new Conversation([id])]
  let result = []

  while (stack.length > 0) {
    let currentChat = stack.pop()

    let nextRoutes = chats
      .filter(c => (isBackward ? getRoutesBackward : getRoutesForward)(currentChat.currentId, chats)
        .some(cr => cr === c.id))

    if (!nextRoutes.length) {
      continue
    }

    let unvisitedRoutes = nextRoutes.filter(c => currentChat.routes.every(cr => cr !== c.id))

    // for the situation when the all available paths was already visited and their number > 1, it will produce
    // unfinished loop. For example, all available routes: 1, 2, 3, 4 were already visited. To avoid it, just need
    // to select one of next routes (the first, for example).
    let routesToGo = !unvisitedRoutes.length ? [nextRoutes[0]] : unvisitedRoutes
    for (let route of routesToGo) {
      let newChat = new Conversation(currentChat.routes.slice(0))
      newChat.addRoute(route.id)

      if ((isBackward && isEndpoint(route)) || (!isBackward && isBye(route))) {
        if (isBackward) {
          return true
        }

        result.push(newChat.routes)
      } else {
        stack.push(newChat)
      }
    };
  }

  return isBackward ? false : result
}

module.exports.getChatsObject = getChatsObject
module.exports.toArray = toArray
module.exports.getPrefix = getPrefix
module.exports.getStartChat = getStartChatId
module.exports.getRoutes = getRoutes
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
