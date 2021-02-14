 let { modules, components } = require('./components.js');
 const path = require('path');
 // import {modules} from './webpack.config.js';
 const fs = require('fs');

 function toCamelCase(str) {
   let index = 0;
   do {
     index = str.indexOf("-", index);
     if (index !== -1) {
       let t = str.substring(0, index);
       t += String.fromCharCode(str.charCodeAt(index + 1) - 32);
       t += str.substr(index + 2);
       str = t;
     }
     else break;
   } while (true);
   return str;
 }

 function lowerCaseFirstChar(str) {
   return String.fromCharCode(str.charCodeAt(0) + 32) + str.substr(1);
 }

 let files = { ...components, ...modules }
 for (let [name, cPath] of Object.entries(files)) {

   let componentName = toCamelCase(name);
   if (componentName.startsWith('CoCreate'))
     componentName = componentName.substr(8);

   if (componentName === componentName.toUpperCase())
     componentName = componentName.toLowerCase();
   else
     componentName = lowerCaseFirstChar(componentName)

   let fileContent = `const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    '${name}': './src/${name}.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].min.js' : '[name].js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: ${ componentName ? `['CoCreate', '${componentName}']` : 'CoCreate'},
    globalObject: "this"
  },
  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on final bundle. For now we don't need production's JavaScript
  // minifying and other thing so let's set mode to development
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [{
      test: /\\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
           presets: ['@babel/preset-env'],
           plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-transform-regenerator"]

        }
      }
    }, ]
  },

  // add source map
  ...(isProduction ? {} : { devtool: 'eval-source-map' }),

  // add uglifyJs
  optimization: {
    minimizer: [new UglifyJsPlugin({
      uglifyOptions: {
        // get options: https://github.com/mishoo/UglifyJS
        drop_console: isProduction
      },
    })],
  },
}
`;
   let p = path.join(cPath, '../../webpack.config.js')
   if(fs.existsSync(p))
    fs.unlinkSync(p)
   fs.writeFileSync(p, fileContent)
 }
 