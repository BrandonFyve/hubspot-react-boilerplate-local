const CopyWebpackPlugin = require('copy-webpack-plugin');
const HubSpotAutoUploadPlugin = require('@hubspot/webpack-cms-plugins/HubSpotAutoUploadPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const hubspotConfig = ({ portal, autoupload } = {}) => {
  return {
    target: 'web',
    entry: {
      main: './src/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'dev'),
      filename: '[name].js',
    },
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { url: false } },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [() => [autoprefixer()]],
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(svg)$/,
          use: [
            {
              loader: 'url-loader',
            },
          ],
        },
      ],
    },
    mode: 'development',
    devServer: {
      static: './dev',
    },
    plugins: [
      new HubSpotAutoUploadPlugin({
        portal,
        autoupload,
        src: 'dist',
        dest: 'cms-react-boilerplate',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/images', to: 'images' },
          {
            from: 'src/modules',
            to: 'modules',
          },
        ],
      }),
      new HtmlWebpackPlugin({
        // hash: true,
        // title: 'My Awesome application',
        // myPageHeader: 'Hello World',
        template: './src/template/index.html',
        filename: './index.html', //relative to root of the application
      }),
    ],
  };
};

module.exports = [hubspotConfig];
