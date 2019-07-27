function VersionWebpackPlugin (options) {

}

VersionWebpackPlugin.prototype.apply = function(compiler) {
    compiler.plugin('emit', function(compilation, callback) {
        var version = 'aaaa';
        compilation.assets['version.txt'] = {
            source: function() {
                return version;
            },
            size: function() {
                return version.length;
            }
        }

        callback();
    })
}

module.exports = VersionWebpackPlugin;