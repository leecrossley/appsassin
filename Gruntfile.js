module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: [
                "*.js",
                "src/*.js",
                "spec/*.js",
                "!src/server.min.js"
            ]
        },
        watch: {
            files: [
                "*.js",
                "src/*.js",
                "spec/*.js",
                "!src/server.min.js"
            ],
            tasks: ["test"]
        },
        jasmine: {
            src: "src/server.js",
            options: {
                specs: "spec/server.js"
            }
        },
        uglify: {
            my_target: {
                files: {
                    "src/server.min.js": [
                        "src/server.js"
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("test", ["jshint", "uglify", "jasmine"]);
};