module.exports = {

  options: {
    preserveComments: false
  },

  'lib': {
    options: {
      sourceMap: false
    },
    files: {
      './dist/assets/libs.min.js': ['./dist/assets/libs.min.js']
    }
  },

  'app': {
    options: {
      sourceMap: true
    },
    files: {
      './dist/assets/app.min.js': ['./dist/assets/app.js']
    }
  }

};