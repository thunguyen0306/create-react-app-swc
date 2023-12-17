module.exports = {
  entry: {
    main: "./src/index.js",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
        },
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        type: "asset/resource",
      },
    ],
  },
};
