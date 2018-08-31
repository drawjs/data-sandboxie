const setGlobalVariable = require( './setGlobalVariable' )
setGlobalVariable()

const express = require( 'express' )
const PATH = require( 'path' )
const webpack = require( 'webpack' )
const webpackConfig = require( './webpack.config.testClient.js' )
const buildDirectory = PATH.resolve( __dirname, './build' )
const { testClientPort } = require( '../../config' )

const compiler = webpack( webpackConfig )

if ( ! __DEV__ ) {
  compiler.run()
}

if ( __DEV__ ) {

const app = express()

// webpck hmr
app.use(
  require( 'webpack-dev-middleware' )( compiler, {
    noInfo    : true,
    publicPath: webpackConfig.output.publicPath
  } )
)

app.use( require( 'webpack-hot-middleware' )( compiler ) )

app.use( express.static( buildDirectory ) )

app.get( "/", ( req, res ) => {
  res.sendFile( PATH.resolve( __dirname, './build/index.html' ) )
} )


app.listen( testClientPort, () => { console.log( `listening on the port ${ testClientPort }` ) } )
}
