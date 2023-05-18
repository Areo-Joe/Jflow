const path = require('path');

module.exports = {
    entry: './src/index',
    output: {
        filename: 'JflowScript',
        path: path.resolve(__dirname),
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "swc-loader"
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    }
}