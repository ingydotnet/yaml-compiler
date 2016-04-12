global.say = console.log
global.yaml = require 'js-yaml'
global.exit = process.exit
global.xxx = ->
  if arguments.length == 1
    say yaml.dump arguments[0]
  else
    say yaml.dump Array.prototype.slice.call arguments
  exit 1
