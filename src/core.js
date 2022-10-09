const { getGitVersion, getDateVersion, getInfo, getTemplate, getVersionsStr } = require('./utils');

const DEFAULT_FILE_NAME = 'version.txt';

function VersionWebpackPlugin(options) {
    const _options = Object.assign({ git: true, basic: true }, options);
    this.git = getOptions(_options.git, { commit: true, author: false, date: false });
    this.basic = getOptions(_options.basic, { date: true, filelist: false });
    this.callback = _options.callback;
    this.filename = _options.filename || DEFAULT_FILE_NAME;
    this.versions = [];
}

function getOptions(value, defaults) {
    let o = null;
    if (value === true) {
        o = defaults;
    } else if (value === false) {
        o = false;
    } else {
        o = Object.assign(defaults, value);
    }
    return o;
}

// function createAsset(str) {
//     return {
//         source: function () {
//             return str;
//         },
//         size: function () {
//             return str.length;
//         }
//     };
// }

VersionWebpackPlugin.prototype.apply = function (compiler) {
    const _this = this;

    compiler.hooks.done.tapPromise(VersionWebpackPlugin.name, async function (stats) {
        const compilation = stats.compilation;
        const versions = [];

        if (_this.basic) {
            const template = getTemplate();
            template.title = 'Basic'
            if (_this.basic.date) {
                const info = getInfo();
                info.key = 'build date';
                info.value = getDateVersion();
                template.infos.push(info);
            }
            if (_this.basic.filelist) {
                var info = getInfo();
                info.key = 'filelist';
                info.value = Object.keys(compilation.assets).map(name => `- ${name}`);
                template.infos.push(info);
            }
            versions.push(template);
        }

        if (_this.git) {
            const template = await getGitVersion(_this.git);
            template && versions.push(template);
        }

        await new Promise((resolve) => {
            compiler.outputFileSystem.writeFile(
                `${compiler.outputPath}/${DEFAULT_FILE_NAME}`,
                getVersionsStr(versions.slice(), _this.callback),
                function (err) {
                    if (err) {
                        console.error(err);
                    }
                    resolve();
                });
        });
    });
}

module.exports = VersionWebpackPlugin;
