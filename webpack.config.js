const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        supercapacitor: './supercapacitor.js'
    },
    output: {
        path: path.resolve('./dist'),
        filename: 'supercapacitor.js',
        libraryTarget: 'umd',
        library: 'supercapacitor'
    },
    module: {
        rules: [
            {
                test: /\.jsx|\.js$/,
                resolve: { extensions: ['.js', '.jsx']},
                loader: 'babel-loader',
                exclude: [
                    path.join(__dirname, 'node_modules')
                ]
            }
        ]
    },
    externals: ['react']
} 