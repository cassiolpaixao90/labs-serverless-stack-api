const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src/main.ts'),
  target: 'node',
  node: {
    __filename: false,
    __dirname: false
  },
  performance: {
    hints: false
  },
  optimization: {
    emitOnErrors: true
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".wasm", ".mjs", ".js", ".json"]
  },
  externals: [
    nodeExternals({
      modulesFromFile: true,
      allowlist: [
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|less|styl)$/,
      ]
    })
  ],
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/platform-express',
          '@nestjs/websockets',
          '@nestjs/grahpql',
,         'cache-manager',
          'class-validator',
          'class-transformer',
        ];

        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource);
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
    new WebpackShellPluginNext({
      onAfterDone: {
          scripts: [
            'echo starting generate swagger...',
            'npx ts-node src/swagger.ts',
            'echo finish success'
          ],
          blocking: true,
          parallel: false
      }
    })
  ],
  output: {
    libraryTarget: 'commonjs',
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  }
};