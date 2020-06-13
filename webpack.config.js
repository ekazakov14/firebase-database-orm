const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
    ],
  },
  watchOptions: {
    aggregateTimeout: 300,
  },
  devtool: 'eval',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  devServer: {
    host: 'localhost',
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
};