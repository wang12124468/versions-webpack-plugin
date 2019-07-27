var process = require('child_process');


function getGitVersion(n) {
    return new Promise(resolve => {
        n = n || 1;
        process.exec('git log -n ' + n, function(error, stdout, stderr) {
            resolve({ error: error, stdout: stdout, stderr: stderr })
        });
    })
}

module.exports.getGitVersion = getGitVersion;

