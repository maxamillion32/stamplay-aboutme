 module.exports = {

   app: {
     options: {
       baseUrl: 'app/',
       optimize: 'none',
       mainConfigFile: './app/main.js',
       paths: {
         jquery: 'empty:',
         hbs: 'bower_components/require-handlebars-plugin/hbs',
         handlebars: 'bower_components/require-handlebars-plugin/Handlebars',
         i18nprecompile: 'bower_components/require-handlebars-plugin/hbs/i18nprecompile',
         json2: 'bower_components/require-handlebars-plugin/hbs/json2',
         underscore: 'bower_components/underscore/underscore',
         require: 'bower_components/requirejs/require'
       },
       exclude: [
        'jquery',
        'require'
      ],
       include: [
         'handlebars',
         'profile_view',
          'edit_view'
      ],
       preserveLicenseComments: false,
       name: 'main',
       out: './dist/assets/app.js'
     }
   }

 };