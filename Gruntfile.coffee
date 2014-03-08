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
        files: ['src/*.coffee', 'spec/*.coffee']
        tasks: ['browserify', 'test']
        options:
          interrupt: true
    jasmine:
      pivotal:
        src: 'dist/arcadia.js'
        options:
          specs: 'spec/js/*-spec.js'
          #helpers: 'spec/js/*-helper.js'
    coffee:
      glob_to_multiple:
        expand: true
        flatten: true
        cwd: 'spec'
        src: ['*.coffee']
        dest: 'spec/js'
        ext: '.js'
    clean: [
      'spec/js'
    ]

  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'

  grunt.registerTask 'default', ['browserify']
  grunt.registerTask 'test', 'translate Jasmine specs, run, then clean', ->
    grunt.option 'force', true
    grunt.task.run ['coffee', 'jasmine', 'clean']
