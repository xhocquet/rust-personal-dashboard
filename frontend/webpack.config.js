const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: "development", // "production" | "development" | "none"
  entry: "./src/index", // string | object | array
  output: {
    path: path.resolve(__dirname, "../backend/static"), // string
    filename: 'bundle.js',
    publicPath: "/static", // string
    libraryTarget: "umd", // universal module definition
  },
  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
  },
  devtool: "inline-source-map", // enum
  devServer: {
    contentBase: './dist',
  },
  context: __dirname, // string (absolute path!)
  target: "web", // enum
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      title: 'Personal Dashboard',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [ // loaders
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
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|ico|woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      }
    ]
  }
}
