// Generated by CoffeeScript 1.9.2
var R, fs, get, getPreset, isThere, nocomments, obtain, path, sourcegate;

require("source-map-support").install();

R = require("ramda");

fs = require("fs");

path = require("path");

isThere = require("is-there");

sourcegate = require("sourcegate");

nocomments = require("strip-json-comments");

obtain = function(somewhere) {
  return JSON.parse(nocomments(fs.readFileSync(path.normalize(somewhere)).toString()));
};

get = function(what, module) {
  var e, where;
  where = ["node_modules/" + what, "node_modules/" + module + "/node_modules/" + what, "node_modules/beverage/node_modules/" + module + "/node_modules/" + what];
  try {
    return obtain(where[0]);
  } catch (_error) {
    try {
      return obtain(where[1]);
    } catch (_error) {
      try {
        return obtain(where[2]);
      } catch (_error) {
        e = _error;
        console.error(e);
        throw new Error("Could not find preset at: " + where);
      }
    }
  }
};

getPreset = function(tool, name, module) {
  var presets, ref;
  presets = {
    jscs: "jscs/presets",
    jshint: {
      airbnb: "airbnb-style/linters/jshintrc"
    },
    eslint: {
      airbnb: "airbnb-style/linters/eslintrc"
    },
    coffeelint: {
      "coffeescript-style-guide": "coffeescript-style-guide/coffeelint.json"
    }
  };
  if (tool === "jscs") {
    return get(presets.jscs + "/" + name + ".json", module);
  } else if (((ref = presets[tool]) != null ? ref[name] : void 0) != null) {
    return get(presets[tool][name], module);
  } else {
    return {};
  }
};

module.exports = function(o, gulp) {
  var base, config, empty, filerc, i, len, module, prefix, preset, ready, ref, ref1, res, sg, sources, watch;
  if (o == null) {
    o = {};
  }
  empty = [[], {}];
  if (R.is(Array, o.sourcegate)) {
    if (R.isEmpty(o.sourcegate)) {
      return [empty];
    }
  } else {
    return [empty];
  }
  ready = [];
  watch = [];
  ref = o.sourcegate;
  for (i = 0, len = ref.length; i < len; i++) {
    sg = ref[i];
    if (sg.options == null) {
      sg.options = {};
    }
    res = R.clone(empty);
    if (sg.sources == null) {
      sg.sources = ((ref1 = o.sourcegateRx) != null ? ref1[sg.recipe] : void 0) || [];
    }
    if (sg.recipe == null) {
      res = [sg.sources, sg.options];
    } else {
      sources = [];
      module = sg.module || o.sourcegateModule;
      prefix = sg.prefix || o.sourcegatePrefix || '';
      preset = sg.preset || o.sourcegatePreset;
      if (preset != null) {
        sources.push(getPreset(sg.recipe, preset, module));
      }
      filerc = sg.recipe === "coffeelint" ? "coffeelint.json" : "." + sg.recipe + "rc";
      config = "" + prefix + filerc;
      if (module) {
        config = "node_modules/" + module + "/" + config;
      }
      config = path.normalize(config);
      if (isThere(config)) {
        if (o.sourcegateWatch) {
          watch.push(config);
        }
        sources.push(config);
      }
      if ((base = sg.options).write == null) {
        base.write = {};
      }
      sg.options.write.path = filerc;
      if (sg.sources != null) {
        sources.concat(sg.sources);
      }
      res = [sources, sg.options];
    }
    ready.push(res);
  }
  if (gulp != null) {
    gulp.task("sourcegate", "Write sourcegate targets.", function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = ready.length; j < len1; j++) {
        sg = ready[j];
        results.push(sourcegate.apply(null, sg));
      }
      return results;
    });
    if (o.sourcegateWatch) {
      gulp.task("sourcegate:watch", "Watch sourcegate sources for changes.", function() {
        return gulp.watch(watch, ["sourcegate"]);
      });
    }
  }
  return ready;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBLG9FQUFBOztBQUFBLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixDQUFDLE9BQTlCLENBQUEsQ0FBQSxDQUFBOztBQUFBLENBQ0EsR0FBSSxPQUFBLENBQVEsT0FBUixDQURKLENBQUE7O0FBQUEsRUFFQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxJQUdBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLE9BSUEsR0FBVSxPQUFBLENBQVEsVUFBUixDQUpWLENBQUE7O0FBQUEsVUFLQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBTGIsQ0FBQTs7QUFBQSxVQU1BLEdBQWEsT0FBQSxDQUFRLHFCQUFSLENBTmIsQ0FBQTs7QUFBQSxNQVVBLEdBQVMsU0FBQyxTQUFELEdBQUE7U0FDUCxJQUFJLENBQUMsS0FBTCxDQUFXLFVBQUEsQ0FBVyxFQUFFLENBQUMsWUFBSCxDQUFnQixJQUFJLENBQUMsU0FBTCxDQUFlLFNBQWYsQ0FBaEIsQ0FBeUMsQ0FBQyxRQUExQyxDQUFBLENBQVgsQ0FBWCxFQURPO0FBQUEsQ0FWVCxDQUFBOztBQUFBLEdBYUEsR0FBTSxTQUFDLElBQUQsRUFBTyxNQUFQLEdBQUE7QUFDSixNQUFBLFFBQUE7QUFBQSxFQUFBLEtBQUEsR0FBUSxDQUNOLGVBQUEsR0FBZ0IsSUFEVixFQUVOLGVBQUEsR0FBZ0IsTUFBaEIsR0FBdUIsZ0JBQXZCLEdBQXVDLElBRmpDLEVBR04scUNBQUEsR0FBc0MsTUFBdEMsR0FBNkMsZ0JBQTdDLEdBQTZELElBSHZELENBQVIsQ0FBQTtBQU1BO1dBQ0UsTUFBQSxDQUFPLEtBQU0sQ0FBQSxDQUFBLENBQWIsRUFERjtHQUFBLGNBQUE7QUFHRTthQUNFLE1BQUEsQ0FBTyxLQUFNLENBQUEsQ0FBQSxDQUFiLEVBREY7S0FBQSxjQUFBO0FBR0U7ZUFDRSxNQUFBLENBQU8sS0FBTSxDQUFBLENBQUEsQ0FBYixFQURGO09BQUEsY0FBQTtBQUdFLFFBREksVUFDSixDQUFBO0FBQUEsUUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLENBQWQsQ0FBQSxDQUFBO0FBQ0EsY0FBVSxJQUFBLEtBQUEsQ0FBTSw0QkFBQSxHQUE2QixLQUFuQyxDQUFWLENBSkY7T0FIRjtLQUhGO0dBUEk7QUFBQSxDQWJOLENBQUE7O0FBQUEsU0FpQ0EsR0FBWSxTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsTUFBYixHQUFBO0FBQ1YsTUFBQSxZQUFBO0FBQUEsRUFBQSxPQUFBLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxjQUFOO0FBQUEsSUFDQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSwrQkFBUjtLQUZGO0FBQUEsSUFHQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSwrQkFBUjtLQUpGO0FBQUEsSUFLQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLDBCQUFBLEVBQTRCLDBDQUE1QjtLQU5GO0dBREYsQ0FBQTtBQVNBLEVBQUEsSUFBRyxJQUFBLEtBQVEsTUFBWDtXQUNFLEdBQUEsQ0FBTyxPQUFPLENBQUMsSUFBVCxHQUFjLEdBQWQsR0FBaUIsSUFBakIsR0FBc0IsT0FBNUIsRUFBb0MsTUFBcEMsRUFERjtHQUFBLE1BRUssSUFBRyw0REFBSDtXQUNILEdBQUEsQ0FBSSxPQUFRLENBQUEsSUFBQSxDQUFNLENBQUEsSUFBQSxDQUFsQixFQUF5QixNQUF6QixFQURHO0dBQUEsTUFBQTtXQUVBLEdBRkE7R0FaSztBQUFBLENBakNaLENBQUE7O0FBQUEsTUFrRE0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsQ0FBRCxFQUFTLElBQVQsR0FBQTtBQUNmLE1BQUEsc0dBQUE7O0lBRGdCLElBQUk7R0FDcEI7QUFBQSxFQUFBLEtBQUEsR0FBUSxDQUFDLEVBQUQsRUFBSyxFQUFMLENBQVIsQ0FBQTtBQUNBLEVBQUEsSUFBRyxDQUFDLENBQUMsRUFBRixDQUFLLEtBQUwsRUFBWSxDQUFDLENBQUMsVUFBZCxDQUFIO0FBQ0UsSUFBQSxJQUFHLENBQUMsQ0FBQyxPQUFGLENBQVUsQ0FBQyxDQUFDLFVBQVosQ0FBSDtBQUFnQyxhQUFPLENBQUMsS0FBRCxDQUFQLENBQWhDO0tBREY7R0FBQSxNQUFBO0FBRUssV0FBTyxDQUFDLEtBQUQsQ0FBUCxDQUZMO0dBREE7QUFBQSxFQUlBLEtBQUEsR0FBUSxFQUpSLENBQUE7QUFBQSxFQUtBLEtBQUEsR0FBUSxFQUxSLENBQUE7QUFPQTtBQUFBLE9BQUEscUNBQUE7Z0JBQUE7O01BQ0UsRUFBRSxDQUFDLFVBQVc7S0FBZDtBQUFBLElBQ0EsR0FBQSxHQUFNLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBUixDQUROLENBQUE7QUFFQSxJQUFBLElBQU8sa0JBQVA7QUFFRSxNQUFBLEVBQUUsQ0FBQyxPQUFILDBDQUE2QixDQUFBLEVBQUUsQ0FBQyxNQUFILFdBQWhCLElBQThCLEVBQTNDLENBRkY7S0FGQTtBQU1BLElBQUEsSUFBTyxpQkFBUDtBQUNFLE1BQUEsR0FBQSxHQUFNLENBQUMsRUFBRSxDQUFDLE9BQUosRUFBYSxFQUFFLENBQUMsT0FBaEIsQ0FBTixDQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLEVBQUUsQ0FBQyxNQUFILElBQWEsQ0FBQyxDQUFDLGdCQUR4QixDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVMsRUFBRSxDQUFDLE1BQUgsSUFBYSxDQUFDLENBQUMsZ0JBQWYsSUFBbUMsRUFGNUMsQ0FBQTtBQUFBLE1BR0EsTUFBQSxHQUFTLEVBQUUsQ0FBQyxNQUFILElBQWEsQ0FBQyxDQUFDLGdCQUh4QixDQUFBO0FBS0EsTUFBQSxJQUFxRCxjQUFyRDtBQUFBLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFBLENBQVUsRUFBRSxDQUFDLE1BQWIsRUFBcUIsTUFBckIsRUFBNkIsTUFBN0IsQ0FBYixDQUFBLENBQUE7T0FMQTtBQUFBLE1BTUEsTUFBQSxHQUFZLEVBQUUsQ0FBQyxNQUFILEtBQWEsWUFBaEIsR0FBa0MsaUJBQWxDLEdBQXlELEdBQUEsR0FBSSxFQUFFLENBQUMsTUFBUCxHQUFjLElBTmhGLENBQUE7QUFBQSxNQU9BLE1BQUEsR0FBUyxFQUFBLEdBQUcsTUFBSCxHQUFZLE1BUHJCLENBQUE7QUFRQSxNQUFBLElBQStDLE1BQS9DO0FBQUEsUUFBQSxNQUFBLEdBQVMsZUFBQSxHQUFnQixNQUFoQixHQUF1QixHQUF2QixHQUEwQixNQUFuQyxDQUFBO09BUkE7QUFBQSxNQVNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBTCxDQUFlLE1BQWYsQ0FUVCxDQUFBO0FBV0EsTUFBQSxJQUFHLE9BQUEsQ0FBUSxNQUFSLENBQUg7QUFDRSxRQUFBLElBQUcsQ0FBQyxDQUFDLGVBQUw7QUFDRSxVQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsTUFBWCxDQUFBLENBREY7U0FBQTtBQUFBLFFBRUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxNQUFiLENBRkEsQ0FERjtPQVhBOztZQWVVLENBQUMsUUFBUztPQWZwQjtBQUFBLE1BZ0JBLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQWpCLEdBQXdCLE1BaEJ4QixDQUFBO0FBa0JBLE1BQUEsSUFBOEIsa0JBQTlCO0FBQUEsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLEVBQUUsQ0FBQyxPQUFsQixDQUFBLENBQUE7T0FsQkE7QUFBQSxNQW1CQSxHQUFBLEdBQU0sQ0FBQyxPQUFELEVBQVUsRUFBRSxDQUFDLE9BQWIsQ0FuQk4sQ0FIRjtLQU5BO0FBQUEsSUE4QkEsS0FBSyxDQUFDLElBQU4sQ0FBVyxHQUFYLENBOUJBLENBREY7QUFBQSxHQVBBO0FBd0NBLEVBQUEsSUFBRyxZQUFIO0FBQ0UsSUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsRUFBd0IsMkJBQXhCLEVBQXFELFNBQUEsR0FBQTtBQUNuRCxVQUFBLGdCQUFBO0FBQUE7V0FBQSx5Q0FBQTtzQkFBQTtBQUNFLHFCQUFBLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLEVBQXVCLEVBQXZCLEVBQUEsQ0FERjtBQUFBO3FCQURtRDtJQUFBLENBQXJELENBQUEsQ0FBQTtBQUdBLElBQUEsSUFBRyxDQUFDLENBQUMsZUFBTDtBQUNFLE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxrQkFBVixFQUNFLHVDQURGLEVBQzJDLFNBQUEsR0FBQTtlQUN2QyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsRUFBa0IsQ0FBQyxZQUFELENBQWxCLEVBRHVDO01BQUEsQ0FEM0MsQ0FBQSxDQURGO0tBSkY7R0F4Q0E7U0FpREEsTUFsRGU7QUFBQSxDQWxEakIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnRcIikuaW5zdGFsbCgpXG5SID0gcmVxdWlyZShcInJhbWRhXCIpXG5mcyA9IHJlcXVpcmUoXCJmc1wiKVxucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5pc1RoZXJlID0gcmVxdWlyZShcImlzLXRoZXJlXCIpXG5zb3VyY2VnYXRlID0gcmVxdWlyZShcInNvdXJjZWdhdGVcIilcbm5vY29tbWVudHMgPSByZXF1aXJlKFwic3RyaXAtanNvbi1jb21tZW50c1wiKVxuI2d1dGlsID0gcmVxdWlyZShcImd1bHAtdXRpbFwiKSAjIGtlZXAgY29tbWVuZWQtb3V0IG9yIG1vdmUgdG8gZGVwZW5kZW5jaWVzXG5cblxub2J0YWluID0gKHNvbWV3aGVyZSkgLT5cbiAgSlNPTi5wYXJzZSBub2NvbW1lbnRzIGZzLnJlYWRGaWxlU3luYyhwYXRoLm5vcm1hbGl6ZSBzb21ld2hlcmUpLnRvU3RyaW5nKClcblxuZ2V0ID0gKHdoYXQsIG1vZHVsZSkgLT5cbiAgd2hlcmUgPSBbXG4gICAgXCJub2RlX21vZHVsZXMvI3t3aGF0fVwiLFxuICAgIFwibm9kZV9tb2R1bGVzLyN7bW9kdWxlfS9ub2RlX21vZHVsZXMvI3t3aGF0fVwiLFxuICAgIFwibm9kZV9tb2R1bGVzL2JldmVyYWdlL25vZGVfbW9kdWxlcy8je21vZHVsZX0vbm9kZV9tb2R1bGVzLyN7d2hhdH1cIlxuICBdXG5cbiAgdHJ5XG4gICAgb2J0YWluIHdoZXJlWzBdXG4gIGNhdGNoXG4gICAgdHJ5XG4gICAgICBvYnRhaW4gd2hlcmVbMV1cbiAgICBjYXRjaFxuICAgICAgdHJ5XG4gICAgICAgIG9idGFpbiB3aGVyZVsyXVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIkNvdWxkIG5vdCBmaW5kIHByZXNldCBhdDogI3t3aGVyZX1cIlxuXG5cbmdldFByZXNldCA9ICh0b29sLCBuYW1lLCBtb2R1bGUpIC0+XG4gIHByZXNldHMgPVxuICAgIGpzY3M6IFwianNjcy9wcmVzZXRzXCIgI3twcmVzZXR9Lmpzb24gd2lsbCBiZSBhcHBlbmRlZFxuICAgIGpzaGludDpcbiAgICAgIGFpcmJuYjogXCJhaXJibmItc3R5bGUvbGludGVycy9qc2hpbnRyY1wiXG4gICAgZXNsaW50OlxuICAgICAgYWlyYm5iOiBcImFpcmJuYi1zdHlsZS9saW50ZXJzL2VzbGludHJjXCJcbiAgICBjb2ZmZWVsaW50OlxuICAgICAgXCJjb2ZmZWVzY3JpcHQtc3R5bGUtZ3VpZGVcIjogXCJjb2ZmZWVzY3JpcHQtc3R5bGUtZ3VpZGUvY29mZmVlbGludC5qc29uXCJcblxuICBpZiB0b29sIGlzIFwianNjc1wiXG4gICAgZ2V0KFwiI3twcmVzZXRzLmpzY3N9LyN7bmFtZX0uanNvblwiLCBtb2R1bGUpXG4gIGVsc2UgaWYgcHJlc2V0c1t0b29sXT9bbmFtZV0/XG4gICAgZ2V0KHByZXNldHNbdG9vbF1bbmFtZV0sIG1vZHVsZSlcbiAgZWxzZSB7fVxuXG5cbm1vZHVsZS5leHBvcnRzID0gKG8gPSB7fSwgZ3VscCkgLT5cbiAgZW1wdHkgPSBbW10sIHt9XVxuICBpZiBSLmlzKEFycmF5LCBvLnNvdXJjZWdhdGUpXG4gICAgaWYgUi5pc0VtcHR5KG8uc291cmNlZ2F0ZSkgdGhlbiByZXR1cm4gW2VtcHR5XVxuICBlbHNlIHJldHVybiBbZW1wdHldICMgb3IgdGhyb3c/XG4gIHJlYWR5ID0gW11cbiAgd2F0Y2ggPSBbXVxuXG4gIGZvciBzZyBpbiBvLnNvdXJjZWdhdGVcbiAgICBzZy5vcHRpb25zID89IHt9XG4gICAgcmVzID0gUi5jbG9uZShlbXB0eSlcbiAgICB1bmxlc3Mgc2cuc291cmNlcz9cbiAgICAgICMgVE9ETzogc291cmNlcyBhcmVuJ3Qgc3BlY2lmaWVkIC0gc2VlbXMgbGlrZSBzb3VyY2VnYXRlUnggY2FuIGJlIGRvbmUgd2l0aG91dD9cbiAgICAgIHNnLnNvdXJjZXMgPSBvLnNvdXJjZWdhdGVSeD9bc2cucmVjaXBlXSBvciBbXVxuXG4gICAgdW5sZXNzIHNnLnJlY2lwZT9cbiAgICAgIHJlcyA9IFtzZy5zb3VyY2VzLCBzZy5vcHRpb25zXVxuICAgIGVsc2VcbiAgICAgIHNvdXJjZXMgPSBbXVxuICAgICAgbW9kdWxlID0gc2cubW9kdWxlIG9yIG8uc291cmNlZ2F0ZU1vZHVsZVxuICAgICAgcHJlZml4ID0gc2cucHJlZml4IG9yIG8uc291cmNlZ2F0ZVByZWZpeCBvciAnJ1xuICAgICAgcHJlc2V0ID0gc2cucHJlc2V0IG9yIG8uc291cmNlZ2F0ZVByZXNldFxuICAgICAgIyAxLiBzdGFydCB3aXRoIHByZXNldCAoc29tZXRoaW5nIGtub3duIC8gc3RhbmRhcmQpXG4gICAgICBzb3VyY2VzLnB1c2ggZ2V0UHJlc2V0KHNnLnJlY2lwZSwgcHJlc2V0LCBtb2R1bGUpIGlmIHByZXNldD9cbiAgICAgIGZpbGVyYyA9IGlmIHNnLnJlY2lwZSBpcyBcImNvZmZlZWxpbnRcIiB0aGVuIFwiY29mZmVlbGludC5qc29uXCIgZWxzZSBcIi4je3NnLnJlY2lwZX1yY1wiXG4gICAgICBjb25maWcgPSBcIiN7cHJlZml4fSN7ZmlsZXJjfVwiXG4gICAgICBjb25maWcgPSBcIm5vZGVfbW9kdWxlcy8je21vZHVsZX0vI3tjb25maWd9XCIgaWYgbW9kdWxlXG4gICAgICBjb25maWcgPSBwYXRoLm5vcm1hbGl6ZShjb25maWcpXG4gICAgICAjIDIuIG92ZXJyaWRlIHdpdGggYSBtb2R1bGUgY29uZmlnIChhbnlib2R5IGNhbiBoYXZlIHByZXNldHMpXG4gICAgICBpZiBpc1RoZXJlIGNvbmZpZ1xuICAgICAgICBpZiBvLnNvdXJjZWdhdGVXYXRjaFxuICAgICAgICAgIHdhdGNoLnB1c2ggY29uZmlnXG4gICAgICAgIHNvdXJjZXMucHVzaCBjb25maWdcbiAgICAgIHNnLm9wdGlvbnMud3JpdGUgPz0ge31cbiAgICAgIHNnLm9wdGlvbnMud3JpdGUucGF0aCA9IGZpbGVyY1xuICAgICAgIyAzLiBzb3VyY2VzLCB3aGV0aGVyIGFuIG9iamVjdCBvciBhcnJheSwgYmVjb21lIHRoZSBmaW5hbCBvdmVycmlkZVxuICAgICAgc291cmNlcy5jb25jYXQoc2cuc291cmNlcykgaWYgc2cuc291cmNlcz9cbiAgICAgIHJlcyA9IFtzb3VyY2VzLCBzZy5vcHRpb25zXVxuXG4gICAgcmVhZHkucHVzaCByZXNcblxuICBpZiBndWxwP1xuICAgIGd1bHAudGFzayBcInNvdXJjZWdhdGVcIiwgXCJXcml0ZSBzb3VyY2VnYXRlIHRhcmdldHMuXCIsIC0+XG4gICAgICBmb3Igc2cgaW4gcmVhZHlcbiAgICAgICAgc291cmNlZ2F0ZS5hcHBseShudWxsLCBzZylcbiAgICBpZiBvLnNvdXJjZWdhdGVXYXRjaFxuICAgICAgZ3VscC50YXNrIFwic291cmNlZ2F0ZTp3YXRjaFwiLFxuICAgICAgICBcIldhdGNoIHNvdXJjZWdhdGUgc291cmNlcyBmb3IgY2hhbmdlcy5cIiwgLT5cbiAgICAgICAgICBndWxwLndhdGNoIHdhdGNoLCBbXCJzb3VyY2VnYXRlXCJdXG5cbiAgcmVhZHlcbiJdfQ==