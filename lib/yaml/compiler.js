// Generated by CoffeeScript 1.10.0
(function() {
  var fs, o, yaml;

  require('../yaml/compiler/prelude');

  fs = require('fs');

  yaml = require('js-yaml');

  o = require('lodash');

  global.YamlCompiler = (function() {
    function YamlCompiler() {}

    YamlCompiler.prototype.run = function(args) {
      var input_file, m, node, root;
      this.get_opts(args);
      input_file = this.args['input-file'][0];
      root = '.';
      if (m = input_file.match(/(.+)\/(.+)/)) {
        this.root = m[1];
        input_file = m[2];
      }
      node = this.compile_file(input_file);
      return this.write_output(node);
    };

    YamlCompiler.prototype.get_opts = function(args) {
      var ArgumentParser, argparse, name, parser;
      argparse = require('argparse');
      ArgumentParser = argparse.ArgumentParser;
      name = process.argv[1].replace(/.*\//, '');
      parser = new ArgumentParser({
        prog: name,
        version: name + " - version 0.0.1",
        addHelp: true,
        description: 'The YAML compiler.',
        epilog: 'If called without options, prints result to stdout.'
      });
      parser.addArgument(['input-file'], {
        nargs: '1',
        help: "The compiler's arguments."
      });
      return this.args = parser.parseArgs(args);
    };

    YamlCompiler.prototype.read_file = function(input_file) {
      if (input_file != null) {
        return String(fs.readFileSync(this.root + "/" + input_file));
      } else {
        return fs.readFileSync('/dev/stdin').toString();
      }
    };

    YamlCompiler.prototype.compile_file = function(input_file) {
      var node;
      node = yaml.load(this.read_file(input_file));
      return this.compile_node(node);
    };

    YamlCompiler.prototype.compile_files = function(files) {
      var file, i, key, len, node, object, value;
      node = {};
      for (i = 0, len = files.length; i < len; i++) {
        file = files[i];
        object = this.compile_file(file);
        if (!o.isObject(object) || o.isArray(object)) {
          throw "'" + file + "' is not a mapping";
        }
        for (key in object) {
          value = object[key];
          node[key] = value;
        }
      }
      return node;
    };

    YamlCompiler.prototype.compile_node = function(node) {
      if (o.isArray(node)) {
        return this.compile_sequence(node);
      } else if (o.isObject(node)) {
        return this.compile_mapping(node);
      } else {
        return this.compile_scalar(node);
      }
    };

    YamlCompiler.prototype.compile_mapping = function(input) {
      var file, key, node, value;
      node = {};
      if (input['<'] != null) {
        file = input['<'];
        delete input['<'];
        if (o.isArray(file)) {
          node = this.compile_files(file);
        } else {
          node = this.compile_file(file);
        }
      }
      for (key in input) {
        value = input[key];
        node[key] = this.compile_node(value);
      }
      return node;
    };

    YamlCompiler.prototype.compile_sequence = function(input) {
      var i, len, node, value;
      node = [];
      for (i = 0, len = input.length; i < len; i++) {
        value = input[i];
        node.push(this.compile_node(value));
      }
      return node;
    };

    YamlCompiler.prototype.compile_scalar = function(input) {
      var m;
      if (o.isString(input) && (m = input.match(/^<\s*(\S+)$/))) {
        return this.compile_file(m[1]);
      } else {
        return input;
      }
    };

    YamlCompiler.prototype.write_output = function(node) {
      return process.stdout.write(yaml.dump(node));
    };

    return YamlCompiler;

  })();

}).call(this);