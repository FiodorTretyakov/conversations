import fs from 'fs';

class conversation {
    constructor(start) {
        this._route = [start];
    }

    get current() {
        return this._route[this._route.length - 1];
    }

    get route() {
        return this._route;
    }

    addRoute(r) {
        this._route.push(r);
        return this;
    };
}

let getChatsObject = (input) => JSON.parse(fs.readFileSync(input, 'utf8'));

let getStartChat = (chats, prefix) =>
    chats.find(c => isStart(c, prefix));

let getRoutesForward = (id, chats) => chats[id].routes.split('|');
let getRoutesBackward = (id, chats) => chats.filter(c => getRoutesForward(c, chats).some(cId => cId === id));

let isEndpoint = (c) => c.stage === 'endpoint';
let isStart = (c, prefix) => c.tag ===  prefix + '-start';
let IsBye = (c) => c.tag === 'bye';

let traverseForward = (chats, id) => {
    let stack = [new conversation(id)];
    let result = [];

    while (stack.length > 0) {
        let currentChat = stack.pop();

        let nextRoutes = getRoutesForward(c.current, chats);
        chats.filter(c => currentChat.routes.every(cId => cId !== c) && nextRoutes.some(cId => cId === c) !== -1)
            .forEach(c => {
                currentChat.addRoute(c);

                if (isBye(chats[c])) {
                    result.push(currentChat.route);
                } else {
                    stack.push(currentChat);
                }
            });
    }

    return result;
}

let traverseBackward = (chats, id) => {
    let stack = [new conversation(id)];
    let result = [];

    while (stack.length > 0) {
        let currentChat = stack.pop();

        let nextRoutes = getRoutesBackward(c.current, chats);
        chats.filter(c => currentChat.routes.indexOf(c) === -1 && nextRoutes.some(cId => cId === c) !== -1)
            .forEach(c => {
                currentChat.addRoute(c);

                if (isEndpoint(chats[c])) {
                    result.push(currentChat.route);
                } else {
                    stack.push(currentChat);
                }
            });
    }

    return result;
}