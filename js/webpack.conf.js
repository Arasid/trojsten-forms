import path from 'path'

const base = {
  entry: {
    main: path.join(__dirname, 'src', 'main.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'build'),
  },
  module: {
    loaders: [
      {
        test : /\.js$/,
        include : path.join(__dirname, 'src'),
        loader : 'babel-loader',
        query : {
          presets : ['es2015', 'react', 'stage-0']
        }
      },
    ],
  },
}

export const webpack_production = {
  ...base,
  debug: false,
}

export const webpack_development = {
  ...base,
  debug: true,
  watch: true,
}

