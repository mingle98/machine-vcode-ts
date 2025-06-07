/*
  开发环境配置：能让代码运行
    运行项目指令：
      webpack 会将打包结果输出出去
      npx webpack-dev-server 只会在内存中编译打包，没有输出
*/

const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'api/built.js',
    path: resolve('../server/public/', 'mlvcode'),
    publicPath: '/',
  },
  module: {
    rules: [
      // loader的配置
      {
        // 处理less资源
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        // 处理css资源
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          // 关闭es6模块化
          esModule: false,
          outputPath: 'static/imgs',
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        // 处理html中img资源
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        // 处理其他资源
        exclude: /\.(html|js|css|less|jpg|png|gif|ts|tsx)/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'static/style',
        },
      },
    ],
  },
  resolve: {
    // 需要打包的文件后缀
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    // plugins的配置
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  mode: 'development',
  devServer: {
    contentBase: resolve(__dirname, 'dist'),
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },
};
