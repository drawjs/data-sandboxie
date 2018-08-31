const PATH = require( 'path' )
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )
const CleanWebpackPlugin = require( 'clean-webpack-plugin' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const BundleAnalyzerPlugin = require( "webpack-bundle-analyzer" ).BundleAnalyzerPlugin

const webpack = require( 'webpack' )

const buildPath = PATH.resolve( __dirname, 'build' )
const openPage = '/build/__test__/Basic'
const template = PATH.resolve( __dirname, './src/__test__/Basic/index.html' )

module.exports = {
  entry: {
    ds: './src/index',
  },
  output: {
    filename     : '[name].js',
    path         : buildPath,
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  // devServer: {
  //   // hot: true,
  //   // port: 9100
  // },
  module : {
    rules: [
      {
        test: /\.ts?$/,
        use : {
          loader: 'ts-loader',
        // options: {
        //   transpileOnly: true //HMR doesn't work without this
        // }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use : [
          {
            loader : 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      },
      // { 
      //   test: /\.svg/, 
      //   loader: "file-loader?mimetype=image/svg+xml",
      //   options: {
      //     // limit: 10000,
      //     name: 'svgs/[name].[ext]'
      //   }        
      // },

    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ],
  },
  // target: 'node',
  plugins: [
    // new CleanWebpackPlugin(['build']),
    new CopyWebpackPlugin( [
      {
        from: './src/__test__',
        to  : '__test__'
      },
      // {
      //   from: './src/assets/svg',
      //   to  : 'svgs'
      // }
    ] ),
    // new BundleAnalyzerPlugin()
  ],
}
