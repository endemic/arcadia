/*jslint sloppy: true */
/*global module: false */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    'src/vectr.game.js',
                    'src/vectr.gameobj.js',
                    'src/vectr.button.js',
                    'src/vectr.emitter.js',
                    'src/vectr.label.js',
                    'src/vectr.pool.js',
                    'src/vectr.scene.js',
                    'src/vectr.shape.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: true,
                compress: true
            },
            dist: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task
    grunt.registerTask('default', ['concat', 'uglify']);
};
