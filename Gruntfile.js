module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),
        
        less: {
            compile: {
                options: {
                    cleancss: false
                },
                files: {
                    "dist/simplezoom.css": "src/simplezoom.less"
                }
            },
            vendor: {
                options: {
                    cleancss: true
                },
                files: {
                    "demo/css/vendor.css": "demo/vendor/less/style.less"
                }
            }
        },

        uglify: {
            options: {
                compress: true,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            compile: {
                files: [{
                    expand: true,
                    flatten: true,
                    ext: '.min.js',
                    src: 'src/**/*.js',
                    dest: 'dist/'
                }]
            }
        },

        watch: {
            less: {
                files: ['src/*.less'],
                tasks: ['less:compile']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['newer:uglify:compile']
            },
            vendor: {
                files: ['demo/vendor/less/*.less'],
                tasks: ['less:vendor']
            }
        }

    });
 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-newer');
 
    grunt.registerTask('default', ['less', 'uglify']);
};