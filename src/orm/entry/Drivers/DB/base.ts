import util = require('util')

import events = require('events')
const EventEmitter = events.EventEmitter

export = () => new EventEmitter()