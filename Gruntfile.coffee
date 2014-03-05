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

  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['browserify']
