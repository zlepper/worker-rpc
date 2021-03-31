const path = require('path');

module.exports = {
  context: path.resolve(__dirname),
  entry: './test-worker.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'test-worker.js',
    path: path.resolve(__dirname, 'build'),
  },
  mode: 'development'
};
