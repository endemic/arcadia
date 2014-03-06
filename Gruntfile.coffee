module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    browserify:
      options:
        standalone: 'Arcadia'
      dist:
        files:
          'dist/arcadia.js': ['src/arcadia.coffee']
        options:
          transform: ['coffeeify']
    watch:
      scripts:
        files: ['src/*.coffee']
        tasks: ['browserify']
        options:
          interrupt: true
    jasmine:
      pivotal:
        src: 'dist/arcadia.js'
        options:
          specs: 'spec/*-spec.js'
          helpers: 'spec/*-helper.js'

  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'default', ['browserify']
  grunt.registerTask 'test', ['jasmine']
