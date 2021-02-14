// Webpack uses this to work with directories
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const getLogger = require('webpack-log');
const log = getLogger({ name: 'webpack-batman' });
let isProduction = process.env.NODE_ENV === 'production';
const { modules, components, builder, htmls } = require("./components");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require("fs")
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const htmlWebpackMultiBuildPlugin = require('html-webpack-multi-build-plugin');

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




let scripts = [];
let configs = [];

let files = { ...components, ...modules }

for (let [name, value] of Object.entries(files)) {
  let componentName = toCamelCase(name);
  if (componentName.startsWith('CoCreate'))
    componentName = componentName.substr(8);

  if (componentName === componentName.toUpperCase())
    componentName = componentName.toLowerCase();
  else
    componentName = lowerCaseFirstChar(componentName)
  let lib

  lib = componentName ? ['CoCreate', componentName] : 'CoCreate';

  let p = files[name];
  let pPath = path.parse(p);
  let filename = pPath.dir + '/../' + 'dist/' +
    name + (isProduction ? '.min.js' : '.js');

  scripts.push(filename)
  log.info(lib);

  let config = {
    entry: {
      [name]: value
    },
    output: {
      path: path.resolve(__dirname),
      filename: (chunkData) => {

        if (chunkData.chunk.name === 'index') {
          return 'dist/' + chunkData.chunk.name + (isProduction ? '.min.js' : '.js');
        }
        else {
          let p = files[chunkData.chunk.name];

          let pPath = path.parse(p);
          let filename = pPath.dir + '/../' + 'dist/' +
            chunkData.chunk.name + (isProduction ? '.min.js' : '.js');
          return filename;

        }

      },
      libraryTarget: 'umd',
      libraryExport: 'default',
      library: lib,
      globalObject: "this",
    },




    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript
    // minifying and other thing so let's set mode to development
    mode: isProduction ? 'production' : 'development',
    module: {
      rules: [{
        test: /\.js$/,
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

  };

  if (lib === "CoCreate")
    console.log(lib)
  configs.push(config)



}


// injecting scripts;

let strScripts = scripts
  .map(s => `<script src="../../../${s}"></script>`)
  .join(' ');
log.info(scripts);

for (let html of htmls) {
  let sHtml = fs.readFileSync(html.template).toString();
  let bIndex = sHtml.indexOf('</body>');
  if (bIndex === -1)
    bIndex = sHtml.indexOf('</ body>');

  if (bIndex === -1)
    throw new Error('closing body tag not found');
  bIndex--;

  sHtml = sHtml.substr(0, bIndex) + strScripts + sHtml.substr(bIndex)
  fs.writeFileSync(html.filename, sHtml)

}
// configs.push({
//   entry: {
//     'CoCreate': './index.js'
//   },
//   output: {
//     path: path.resolve(__dirname),
//     filename: (chunkData) => {
//       return 'dist/' + chunkData.chunk.name + (isProduction ? '.min.js' : '.js');
//     },
//     libraryTarget: 'umd',
//     libraryExport: 'default',
//     library: 'CoCreate',
//     globalObject: "this",
//   },
//   ...otherConfig
// })


module.exports = configs;
