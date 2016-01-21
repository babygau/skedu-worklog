import path from 'path'
import webpack from 'webpack'

export
default {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/js/index'
  ],
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  module: {
    loaders: [
      // Needed for using ES6 syntax
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      // **IMPORTANT** This is needed so that each bootstrap js file required by
      // bootstrap-webpack has access to the jQuery object

      // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
      // loads bootstrap's css.


      {
        test: /\.woff2?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.svg$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }, {
        test: /(\.eot$|\.png$|\.jpeg$|\.jpg$)/,
        loader: 'file-loader'
      },
      // Sass loader
      // resolve-url-loader needed for working with Bootstrap
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'autoprefixer', 'resolve-url', 'sass?sourceMap']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }
    ]
  }
}
