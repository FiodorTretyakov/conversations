const conversations = require('./conversations.js')

conversations.getAllRoutes('labels.json')
conversations.getAllRoutes('allornothing.json')
conversations.isEndpointPassed('labels.json')
