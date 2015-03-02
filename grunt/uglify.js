module.exports = {

  options: {
    preserveComments: false
  },

  'lib': {
    options: {
      sourceMap: false
    },
    files: {
      './dist/js/libs.min.js': ['./dist/js/libs.min.js']
    }
  },

  'app': {
    options: {
      sourceMap: true
    },
    files: {
      './dist/js/app.min.js': ['./dist/js/app.js']
    }
  },

  'requirejs': {
    files: {
      './dist/js/require.min.js': ['./app/bower_components/requirejs/require.js']
    }
  }

};