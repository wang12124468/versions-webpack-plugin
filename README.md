# Versions Webpack Plugin

> If your webpack < 4, please use the version of 1.x with the same configuration.

Plugin that create informations of versions.

## Installing

Using npm: 

`npm install versions-webpack-plugin`

Using yarn:

`yarn add versions-webpack-plugin`

## Example

### Basic

        const VersionsWebpackPlugin = require('versions-webpack-plugin')
        
        module.exports = {
            entry: 'index.js',
            output: {
                path: __dirname + '/dist',
                filename: 'index_bundle.js'
            },
            plugins: [
                new VersionsWebpackPlugin()
            ]
        }


        // versions.txt
        Basic: 
            build date: 2019-08-01 11:58:54

        Git: 
            commit: 4a2cdd89d3bc1fd051649d104f7ea643ec566dfc

### Options

        const options = {

            filename: 'versions.txt',

            basic: true,
            // basic: {
            //     date: true,
            //     filelist: false
            // },

            git: true,
            // git: {
            //     commit: true,
            //     author: false,
            //     date: false
            // },

            // callback: versions => 'This is a versions file!',
            // callback: versions => {
            //     versions.push({ title: 'My versions', infos: [{ key: 'version', value: require('./package.json').version }] })
            //     return versions;
            // },
        }