import fs from 'fs';

const startLabel = '-start';
const byeLabel = "bye";

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
    chats.filter(c => chats[c].tag === prefix + startLabel)[0];

let getRoutesForward = (id, chats) => chats[id].routes.split('|');
let getRoutesBackward = (id, chats) => chats.filter(c => getRoutesForward(c, chats).indexOf(id) !== -1);

let isSearch

let traverse = (chats, id, getNextRoutes) => {
    let stack = [new conversation(id)];
    let result = [];

    while (stack.length > 0) {
        let c = stack.pop();

        let nextRoutes = getNextRoutes(c.current, chats);
        for (let chat in chats) {
            if (c.routes.indexOf(chat) === -1 && nextRoutes.indexOf(chat) !== -1) {
                c.addRoute(chat);

                if (chats[chat].tag === byeLabel) {
                    result.push(c.route);
                } else {
                    stack.push(c);
                }
            }
        }
    }

    return result;
}