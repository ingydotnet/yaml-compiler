require '../yaml/compiler/prelude'
fs = require 'fs'
yaml = require 'js-yaml'
o = require 'lodash'

class global.YamlCompiler
  run: (args)->
    @get_opts args
    input_file = @args['input-file'][0]
    root = '.'
    if m = input_file.match /(.+)\/(.+)/
      @root = m[1]
      input_file = m[2]
    node = @compile_file input_file
    @write_output node

  get_opts: (args)->
    argparse = require 'argparse'
    ArgumentParser = argparse.ArgumentParser
    name = process.argv[1].replace /.*\//, ''
    parser = new ArgumentParser
      prog: name
      version: "#{name} - version 0.0.1"
      addHelp: true
      description: 'The YAML compiler.'
      epilog: 'If called without options, prints result to stdout.'
    parser.addArgument \
      [ 'input-file' ],
      nargs: '1'
      help: "The compiler's arguments."
    @args = parser.parseArgs(args)

  read_file: (input_file)->
    if input_file?
      String fs.readFileSync "#{@root}/#{input_file}"
    else
      fs.readFileSync('/dev/stdin').toString()

  compile_file: (input_file)->
    node = yaml.load @read_file input_file
    @compile_node node

  compile_files: (files)->
    node = {}
    for file in files
      object = @compile_file file
      if ! o.isObject(object) or o.isArray(object)
        throw "'#{file}' is not a mapping"
      for key, value of object
        node[key] = value
    node

  compile_node: (node)->
    if o.isArray node
      @compile_sequence node
    else if o.isObject node
      @compile_mapping node
    else
      @compile_scalar node

  compile_mapping: (input)->
    node = {}
    if input['<']?
      file = input['<']
      delete input['<']
      if o.isArray file
        node = @compile_files file
      else
        node = @compile_file file
    for key, value of input
      node[key] = @compile_node value
    node

  compile_sequence: (input)->
    node = []
    for value in input
      node.push @compile_node value
    node

  compile_scalar: (input)->
    if o.isString(input) and m = input.match /^<\s*(\S+)$/
      @compile_file m[1]
    else
      input

  write_output: (node)->
    process.stdout.write yaml.dump node

# vim: set sw=2:
