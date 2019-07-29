var utils = require('./utils');
var getGitVersion = utils.getGitVersion;
var getDateVersion = utils.getDateVersion;
var getInfo = utils.getInfo;
var getTemplate = utils.getTemplate;
var getVersionsStr = utils.getVersionsStr;


function VersionWebpackPlugin(options) {
    var _options = Object.assign({ gitVersion: true }, options);
    this.git = _options.git;
    this.basic = _options.basic;
    this.callback = _options.callback;
    this.versions = [];
}

function createVersions(compilation, version) {
    compilation.assets['version.txt'] = {
        source: function () {
            return version;
        },
        size: function () {
            return version.length;
        }
    }
}

VersionWebpackPlugin.prototype.apply = function (compiler) {
    var _this = this;
    compiler.plugin('emit', async function (compilation, callback) {
        var versions = [];
        if (_this.basic) {
            var template = getTemplate();
            template.title = 'Basic'
            var info = getInfo();
            info.key = 'Build time';
            info.value = getDateVersion();
            template.infos.push(info);

            versions.push(template);
        }

        if(_this.git) {
            var template = await getGitVersion();
            versions.push(template);
        }


        if(typeof _this.callback === 'function') {
            var _versions = _this.callback(versions);
            versions = _versions || versions;
        }

        createVersions(compilation, getVersionsStr(versions));
        callback();
    })
}

module.exports = VersionWebpackPlugin;