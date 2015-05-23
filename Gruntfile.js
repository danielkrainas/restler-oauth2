process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        jshint: {
            all: {
                src: ['index.js', 'lib/*.js'],
                options: {
                    globalstrict: true,
                    globals: {
                        exports: false,
                        console: false
                    }
                }
            }
        },
        
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/*.js']
        },

        mocha_istanbul: {
            coverage: {
                src: 'test',
                options: {
                    coverageFolder: '.coverage'
                }
            }
        },
        codeclimate: {
            options: {
                file: '.coverage/lcov.info',
                token: process.env.CODECLIMATE_TOKEN
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-codeclimate-reporter');

    grunt.registerTask('test', ['jshint', 'mochaTest']);
    grunt.registerTask('default', 'test');
    grunt.registerTask('coverage', ['mocha_istanbul']);
    grunt.registerTask('coverage:report', ['coverage', 'codeclimate']);
};
