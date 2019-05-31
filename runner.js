const conversations = require('./conversations.js')

console.log(conversations.getAllRoutes('labels.json'))
console.log(conversations.getAllRoutes('allornothing.json'))
console.log(conversations.isEndpointPassed('labels.json'))
