
module.exports = {
  entry: [__dirname + '/mainPage.js'],
  output: {
    filename: __dirname + '/public/compiled/app-bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'sourcemap'
}
