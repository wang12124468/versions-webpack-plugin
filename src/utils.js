var process = require('child_process');

function format(date, formatStr) {
    var formatStr = '';
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(formatStr)) {
        formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return formatStr;
}

function getGitVersion(n) {
    return new Promise(resolve => {
        n = n || 1;
        process.exec('git log -n ' + n, function (error, stdout, stderr) {
            var template = getTemplate();
            template.title = 'Git';
            if (stdout) {
                var str = stdout.split('\n')[0] || '';
                var commitId = str.replace('commit ');
                if (commitId) {
                    template.infos.push({ key: 'commit', value: commitId });
                }
            }
            resolve(template);
        });
    })
}

function getDateVersion() {
    return format(new Date(), 'yyyy-MM-dd hh:mm:ss');
}

function addColon(str) {
    return /:：/.test(str) ? str : (str + ': ');
}

function getVersionsStr(versions, callback) {
    if (typeof callback === 'function') {
        var result = callback(versions);
        if (!Array.isArray(result)) {
            return result + '';
        }

        versions = result;
    }

    return versions.map(function (version) {
        var res = '';
        var title = version.title || '';
        var infos = version.infos || [];
        res += addColon(title);
        res += '\n';
        var infosStr = infos.map(function (info) {
            var res = '';
            var key = addColon(info.key || '');
            var value = info.value || '';
            res += '\t';
            res += addColon(key);
            res += value;
            return res;
        }).join('\n');
        res += infosStr;
        return res;
    }).join('\n\n\n');
}

function getTemplate() {
    return {
        title: '',
        infos: []
    }
}

function getInfo() {
    return {
        key: '',
        value: ''
    }
}

module.exports.getGitVersion = getGitVersion;
module.exports.getDateVersion = getDateVersion;
module.exports.getTemplate = getTemplate;
module.exports.getInfo = getInfo;
module.exports.getVersionsStr = getVersionsStr;

