const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "../backend/static"),
    filename: 'bundle.js',
    publicPath: "/static",
    libraryTarget: "umd",
  },
  performance: {
    hints: "warning",
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
  },
  devtool: "inline-source-map",
  context: __dirname,
  target: "web",
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Personal Dashboard',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif|ico|woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ],
      }
    ],
  }
}
