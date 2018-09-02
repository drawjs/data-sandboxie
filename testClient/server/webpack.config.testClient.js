const PATH = require( "path" )
const webpack = require( "webpack" )
const CopyWebpackPlugin = require( "copy-webpack-plugin" )
const VueLoaderPlugin = require( "vue-loader/lib/plugin" )

const { testClientOutputName } = require( "../../config" )
const { BundleAnalyzerPlugin } = require( "webpack-bundle-analyzer" )

const clientPath = PATH.resolve( __dirname, "../client" )
const clientIndexPath = PATH.resolve( clientPath, "./index.html" )
const clientEntryPath = PATH.resolve( clientPath, "entry.js" )
const clientAssetsPath = PATH.resolve( clientPath, "assets" )

const buildPath = PATH.resolve( __dirname, `../../${testClientOutputName}` )
const outputIndexPath = PATH.resolve( buildPath, "./index.html" )
const targetAssetsPath = PATH.resolve( buildPath, "assets" )
const stylus = require( "stylus" )

module.exports = {
  mode : __DEV__ ? "development" : "production",
  entry: {
    app: [ clientEntryPath ].concat( __DEV__ ? [ "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000" ] : [] )
  },
  devtool: __DEV__ ? "inline-source-map" : false,
  output : {
    filename: "[name].bundle.js",
    path    : buildPath
  },
  module: {
    rules: [
      {
        test   : /\.vue$/,
        loader : "vue-loader",
        exclude: /node_modules/,
        options: {
          hotReload: __DEV__,
          loaders  : {
            css: "vue-style-loader!css-loader"
          }
        }
      },
      {
        test: /\.css$/,
        use : [ "vue-style-loader", "css-loader" ]
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js"
    },
    extensions: [ "*", ".js", ".vue", ".json" ]
  },
  plugins: [
    new CopyWebpackPlugin( [
      {
        from: clientIndexPath,
        to  : outputIndexPath
      },
      {
        from: clientAssetsPath,
        to  : targetAssetsPath
      }
    ] ),
    new VueLoaderPlugin()
  ].concat( __DEV__ ? [ new webpack.HotModuleReplacementPlugin() ] : [
    //  new BundleAnalyzerPlugin() 
    ] 
    )
}
