var utils = require('./utils');
var getGitVersion = utils.getGitVersion;
var getDateVersion = utils.getDateVersion;
var getInfo = utils.getInfo;
var getTemplate = utils.getTemplate;
var getVersionsStr = utils.getVersionsStr;


var DEFAULT_FILE_NAME = 'version.txt';

function VersionWebpackPlugin(options) {
    var _options = Object.assign({ gitVersion: true }, options);
    this.git = _options.git;
    this.basic = _options.basic;
    this.callback = _options.callback;
    this.fileName = _options.fileName || DEFAULT_FILE_NAME;
    this.versions = [];
}

function createAsset(str) {
    return {
        source: function () {
            return str;
        },
        size: function () {
            return str.length;
        }
    };
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
            var _versions = _this.callback(versions.slice());
            versions = _versions || versions;
        }

        var asset = createAsset(getVersionsStr(versions));
        compilation.assets[_this.fileName] = asset;
        callback();
    })
}

module.exports = VersionWebpackPlugin;