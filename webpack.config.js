const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          happyPackMode: true,
        },
      }
    ],
  },
  watchOptions: {
    aggregateTimeout: 300,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@root': path.resolve(__dirname, 'src'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@decorators': path.resolve(__dirname, 'src/decorators'),
      '@type': path.resolve(__dirname, 'src/types'),
    },
  },
  devServer: {
    host: 'localhost',
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
};