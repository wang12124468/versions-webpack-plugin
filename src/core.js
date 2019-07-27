var getGitVersion = require('./utils').getGitVersion;

function VersionWebpackPlugin (options) {
    var _options = Object.assign({ gitVersion: true }, options);
    this.gitVersion = _options.gitVersion;
}

function handle(compilation, version, callback) {
    compilation.assets['version.txt'] = {
        source: function() {
            return version;
        },
        size: function() {
            return version.length;
        }
    }
    callback();
}

VersionWebpackPlugin.prototype.apply = function(compiler) {
    var _this = this;
    compiler.plugin('emit', function(compilation, callback) {
        var version = '';

        if(_this.gitVersion) {
            getGitVersion().then(function (values) {
                version += values.stdout;
                handle(compilation, version, callback);
            });
        } else {
            handle(compilation, version, callback);
        }
    })
}

module.exports = VersionWebpackPlugin;