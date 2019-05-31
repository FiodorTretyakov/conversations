import fs from 'fs'

class Conversation {
    constructor(start) {
        this._route = [start]
    }

    get current() {
        return this._route[this._route.length - 1]
    }

    get route() {
        return this._route
    }

    addRoute(r) {
        this._route.push(r)
        return this
    };
}

let getChatsObject = (fileName) => JSON.parse(fs.readFileSync(fileName, 'utf8'))
let getPrefix = (fileName) => fileName.split('.')[0]

// if no start tag, it will throw unhandled exception, because of it is critical piece
let getStartChat = (chats, prefix) => chats.find(c => isStart(c, prefix))

let getRoutesForward = (id, chats) => chats[id].routes.split('|')
let getRoutesBackward = (id, chats) => chats.filter(c => getRoutesForward(c, chats).some(cId => cId === id))

let isEndpoint = (c) => c.stage === 'endpoint'
let isStart = (c, prefix) => c.tag === prefix + '-start'
let isBye = (c) => c.tag === 'bye'

let traverse = (chats, id, isBackward) => {
    let stack = [new Conversation(id)]
    let result = []

    while (stack.length > 0) {
        let currentChat = stack.pop()

        let nextRoutes = (isBackward ? getRoutesBackward : getRoutesForward)(currentChat, chats)
        for (let c of chats.filter(c => currentChat.routes.every(cId => cId !== c) &&
            nextRoutes.some(cId => cId === c) !== -1)) {
            currentChat.addRoute(c)

            if ((isBackward && isEndpoint(chats[c])) || (!isBackward && isBye(chats[c]))) {
                if (isBackward) {
                    return true
                }

                result.push(currentChat.route)
            } else {
                stack.push(currentChat)
            }
        };
    }

    return isBackward ? false : result
}

var getAllRoutes = (fileName) => {
    let chats = getChatsObject(fileName)
    return traverse(chats, getStartChat(chats, getPrefix(fileName)))
}

var isEndpointPassed = (fileName, id) => traverse(getChatsObject(fileName), id, true)
