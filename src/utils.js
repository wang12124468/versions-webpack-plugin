var process = require('child_process');

function format(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getGitVersion({ commit, author, date } = {}) {
    return new Promise(resolve => {

        try {
            const template = getTemplate();
            template.title = 'Git';

            const [ c, a, d ] = process.execSync('git log -n 1 --pretty="%H,%an<%aE>,%ad"')
                    .toString().split(',');
            if(commit) {
                template.infos.push({ key: 'commit', value: c });
            }
            if(author) {
                template.infos.push({ key: 'author', value: a });
            }
            if(date) {
                template.infos.push({ key: 'date', value: d });
            }
            
            resolve(template);
        } catch (error) {
            console.warn('Git commit informations fail:\n');
            console.warn(error);
            resolve(null);
        }
    })
}

function getDateVersion() {
    return format(new Date(), 'yyyy-MM-dd hh:mm:ss');
}

function addColon(str) {
    return /[:：]/.test(str) ? str : (str + ': ');
}

function getVersionsStr(versions, callback) {
    if (typeof callback === 'function') {
        const result = callback(versions);
        if (!Array.isArray(result)) {
            return result + '';
        }

        versions = result;
    }

    return versions.map(function ({ title = '', infos = [] }) {
        let res = '';
        res += addColon(title);
        res += '\n';
        const infosStr = infos.map(function ({ key = '', value = '' }) {
            let res = '';
            res += '\t';
            res += addColon(key);
            if(Array.isArray(value)) {
                value.map(i => res+= `\n\t\t${i}`)
            } else {
                res += value;
            }
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

module.exports = { getGitVersion, getDateVersion, getTemplate, getInfo, getVersionsStr };

