// Generated by CoffeeScript 1.10.0
(function() {
  global.say = console.log;

  global.yaml = require('js-yaml');

  global.exit = process.exit;

  global.xxx = function() {
    if (arguments.length === 1) {
      say(yaml.dump(arguments[0]));
    } else {
      say(yaml.dump(Array.prototype.slice.call(arguments)));
    }
    return exit(1);
  };

}).call(this);