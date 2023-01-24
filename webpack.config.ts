import { resolve } from 'path'
import { Configuration, WebpackPluginInstance } from 'webpack'
import { merge } from 'webpack-merge'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackShellPlugin from 'webpack-shell-plugin-next'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
import webpackNodeExternals from 'webpack-node-externals'

interface Env {
  NODE_ENV?: 'production' | 'development'
}

const { NODE_ENV = 'production' } = process.env as Env

const BaseConfig: Configuration = {
  mode: NODE_ENV,
  devtool: NODE_ENV === 'development' && 'source-map',
  watch: NODE_ENV === 'development',
  module: {
    generator: {
      'asset/resource': { outputPath: 'assets' },
      'asset': { outputPath: 'assets' }
    },
    rules: [
      {
        test: /\.(?:[jt]sx?)$/i,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(?:css)$/i,
        exclude: /node_modules/,
        use: [
          NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      },
      {
        test: /\.(?:a?png|gif|webp|ico|cur|tiff?|bmp|avif|jp(?:eg?|g)|jf?if|pjp(?:eg)?)$/i,
        type: 'asset/resource',
        generator: {
          outputPath: 'assets/images',
          publicPath: '/assets/images/'
        }
      },
      {
        test: /\.(?:svg)$/i,
        exclude: /node_modules/,
        type: 'asset/resource',
        resourceQuery: /url/,
        generator: {
          outputPath: 'assets/images',
          publicPath: '/assets/images/'
        }
      },
      {
        test: /\.(?:svg)$/i,
        exclude: /node_modules/,
        use: '@svgr/webpack',
        resourceQuery: { not: /url/ }
      }
    ]
  },
  plugins: [
    new ESLintWebpackPlugin({
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.svg'],
    alias: {
      src: '/src',
      client: '/src/client',
      server: '/src/server'
    }
  },
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()]
  }
}

const ClientConfig: Configuration = {
  name: 'client',
  entry: resolve(__dirname, 'src/client/index.tsx'),
  plugins: [
    NODE_ENV === 'production' && new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'src/client/index.html')
    })
  ].filter(p => !!p) as WebpackPluginInstance[],
  output: {
    path: resolve(__dirname, 'out/public'),
    filename: '[name].bundle.js',
    publicPath: '/',
    clean: true
  }
}

const ServerConfig: Configuration = {
  name: 'server',
  entry: resolve(__dirname, 'src/server/index.ts'),
  target: 'node',
  externals: [webpackNodeExternals()],
  plugins: [
    NODE_ENV === 'development' &&
      new WebpackShellPlugin({
        onBuildEnd: {
          scripts: ['nodemon .'],
          blocking: false,
          parallel: true
        }
      })
  ].filter(p => !!p) as WebpackPluginInstance[],
  output: {
    path: resolve(__dirname, 'out'),
    filename: 'index.js',
    clean: {
      keep: 'public'
    }
  }
}

export default [
  merge(ServerConfig, BaseConfig),
  merge(ClientConfig, BaseConfig)
]
