#!/usr/bin/env coffee

say = console.log
xxx = ->
    say yaml.dump Array.prototype.slice.call arguments
    process.exit 1

fs = require 'fs'
compiler = require './lib/yaml/compiler'

input = String fs.readFileSync 'test/test1.yaml'

compiler.compile input
