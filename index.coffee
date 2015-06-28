require("source-map-support").install()
R = require("ramda")
fs = require("fs")
path = require("path")
isThere = require("is-there")
sourcegate = require("sourcegate")
nocomments = require("strip-json-comments")
task = require("stamina").gulpTask
#gutil = require("gulp-util") # keep commened-out or move to dependencies


obtain = (somewhere) ->
  JSON.parse nocomments fs.readFileSync(path.normalize somewhere).toString()

get = (what, module) ->
  # gutil.log "find what '#{what}' in module '#{module}'"
  where = [
    "node_modules/#{what}",
    "node_modules/#{module}/node_modules/#{what}",
    "node_modules/beverage/node_modules/#{module}/node_modules/#{what}"
  ]

  last = where.length - 1
  for i in [0..last]
    try
      return obtain where[i]
    catch e
      if i is last
        console.error(e)
        throw new Error "Could not find preset at: #{where}"
      continue


getPreset = (tool, name, module) ->
  presets =
    jscs: "jscs/presets" #{preset}.json will be appended
    jshint:
      airbnb: "airbnb-style/linters/jshintrc"
    eslint:
      airbnb: "airbnb-style/linters/.eslintrc"
    coffeelint:
      "coffeescript-style-guide": "coffeescript-style-guide/coffeelint.json"

  if tool is "jscs"
    get("#{presets.jscs}/#{name}.json", module)
  else if presets[tool]?[name]?
    get(presets[tool][name], module)
  else {}


module.exports = (o = {}, gulp) ->
  empty = [[], {}]
  if R.is(Array, o.sourcegate)
    if R.isEmpty(o.sourcegate) then return [empty]
  else return [empty] # or throw?
  o.sourceopt ?= {}
  ready = []
  watch = []

  for sg in o.sourcegate
    res = R.clone(empty)
    sg.options ?= {}

    unless sg.recipe?
      # 0. without a recipe, hal-rc just hands sources and options to sourcegate
      res = [sg.sources, sg.options]
    else
      sources = []
      module = sg.module or o.sourceopt.module
      prefix = sg.prefix or o.sourceopt.prefix or ''
      preset = sg.preset or o.sourceopt.preset
      # 1. start with preset (something known / standard)
      sources.push getPreset(sg.recipe, preset, module) if preset?
      filerc = if sg.recipe is "coffeelint" then "coffeelint.json" else ".#{sg.recipe}rc"
      if module?
        # 2. override with a module config (anybody can have presets)
        config = "#{prefix}#{filerc}"
        config = "node_modules/#{module}/#{config}" if module # false is a valid value
        config = path.normalize(config)

        unless isThere config
          console.error "Could not find: #{config}"
        else
          if o.sourceopt.watch
            watch.push config
          sources.push config
      sg.options.write ?= {}
      sg.options.write.path = filerc
      # 3. sources, whether an object or array, become the final override
      sources = sources.concat(sg.sources) if sg.sources?
      res = [sources, sg.options]

    ready.push res

  # optional gulp / tasks
  if gulp?
    task gulp, "sourcegate", "Write sourcegate targets.", ->
      for sg in ready
        sourcegate.apply(null, sg)
    if o.sourceopt.watch
      task gulp, "sourcegate:watch",
        "Watch sourcegate sources for changes.", ->
          gulp.watch watch, ["sourcegate"]

  ready
