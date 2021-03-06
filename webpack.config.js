var path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'
const CleanWebPackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const DefinePlugin = require('webpack').DefinePlugin
const fs = require('fs')
const express = require('express')

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'index.html'),
    env: process.env.NODE_ENV
  }),
  new DefinePlugin({ __FILES__: JSON.stringify(fs.readdirSync('./public/emoji')) })
]

if (!devMode) {
  plugins.push(
    new CopyWebpackPlugin([{ from: 'public/', to: '.' }]),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
  )
}

if (!devMode && !process.env.CI) {
  plugins.push(new CleanWebPackPlugin(['build'], {
    root: path.resolve(__dirname),
    verbose: true
  }))
}

module.exports = {
  mode: devMode ? 'development' : 'production',
  plugins,
  entry: {
    app: ['./src/index.tsx']
  },
  optimization: {
    // minimize: !devMode
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/bag/emoji',
    filename: 'bundle.[hash].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  devServer: {
    before(app) {
      app.use('/bag/emoji', express.static('./public'))
    },
    contentBase: './public',
  }
}
