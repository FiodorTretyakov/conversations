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
let isStart = (c, prefix) => c.tag === prefix + '-start';
let IsBye = (c) => c.tag === 'bye';

let traverseForward = (chats, id, isSearchBackward) => {
    let stack = [new conversation(id)];
    let result = [];

    while (stack.length > 0) {
        let currentChat = stack.pop();

        for (let c of chats.filter(c => currentChat.routes.every(cId => cId !== c)
            && (isSearchBackward ? getRoutesBackward : getRoutesForward)
                (getRoutesForward(c.current, chats).some(cId => cId === c) !== -1))) {
            currentChat.addRoute(c);

            if ((isSearchBackward && isEndpoint(chats[c])) || (!isSearchBackward && isBye(chats[c]))) {
                if (isSearchBackward) {
                    return true;
                }
                
                result.push(currentChat.route);
            } else {
                stack.push(currentChat);
            }
        };
    }

    return result;
}