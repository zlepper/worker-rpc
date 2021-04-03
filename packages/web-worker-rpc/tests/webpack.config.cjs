const path = require('path');

module.exports = {
  context: path.resolve(__dirname),
  entry: {
    worker: './test-worker.ts',
    spec: './tests.spec.ts'
  },
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
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  mode: 'development'
};
