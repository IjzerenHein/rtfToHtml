/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    peg: {
      parser: {
        src: 'src/parser/parser.peg',
        dest: 'src/parser/parser.js'
      }
    },
    eslint: {
      target: ['src/*.js', 'test/*.js'],
      options: {
        config: '.eslintrc'
      }
    },
    jscs: {
        src: ['src/*.js', 'test/*.js'],
        options: {
            config: '.jscsrc'
        }
    },
    exec: {
      'test-superSimple': './node_modules/.bin/babel-node ./src/rtfToHtml.js ./samples/superSimple.rtf ./html/superSimple.html',
      'test-simple': './node_modules/.bin/babel-node ./src/rtfToHtml.js ./samples/simple.rtf ./html/simple.html',
      'test': './node_modules/.bin/babel-node ./src/rtfToHtml.js ./samples/text.rtf ./html/medium.html',
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-peg');
  grunt.loadNpmTasks('grunt-exec');

  // Tasks
  grunt.registerTask('lint', ['eslint', 'jscs']);
  grunt.registerTask('parser', ['peg']);
  grunt.registerTask('dist', ['parser']);
  grunt.registerTask('test', ['parser', 'exec:test']);
  grunt.registerTask('default', ['lint', 'dist']);
};
