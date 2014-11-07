
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var base = './';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // sass: {
        //     dist: {
        //         files: {
        //             'css/i.css': '_sass/i.scss'
        //         }
        //     }
        // },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [ base ]
                }
            }
        },
        watch: {
            html: {
                files: [
                    'index.html',
                ],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['js/app.js'],
                options: {
                    livereload: true
                }
            }
            //},
            // css: {
            //     files: ['_sass/*.scss', 'css/i.css'],
            //     tasks: ['sass', 'jekyll'],
            //     options: {
            //         livereload: true
            //     }
            // }
        }
    });

    grunt.registerTask('serve', function () {
        grunt.task.run([
            //'sass',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('default', ['serve']);
}
