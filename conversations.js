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

let getStartChat = (chats, prefix) => {
    let startTag = prefix + startLabel;
    for (let c in chats) {
        if (chats[c].tag == startTag) {
            return c;
        }
    }
}

let getNextRoutes = (c) => c.routes.split('|');

let traverse = (chats, start) => {
    let stack = [new conversation(start)];
    let result = [];

    while (stack.length > 0) {
        let c = stack.pop();

        c.addRoute(c.current);
        let nextRoutes = getNextRoutes(chats[c]);
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

let isMetEndpointBefore = (chats, id) => {

}