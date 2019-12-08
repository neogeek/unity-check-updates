const {readFileSync} = require('fs');
const packageJson = require('package-json');

const semver = require('semver');

const unityCheckUpdate = async (path, {allowPreview = false} = {}) => {

    const {dependencies} = JSON.parse(readFileSync(
        path,
        'utf8'
    ));

    return (await Promise.all(Object.keys(dependencies).map(async dependency => {

        try {

            const {versions} = await packageJson(
                dependency,
                {
                    'allVersions': true,
                    'registryUrl': 'https://packages.unity.com/'
                }
            );

            const currentVersion = dependencies[dependency];

            const nextVersion = Object.keys(versions)
                .filter(version => allowPreview || !version.match('preview'))
                .sort((a, b) => semver.compare(
                    a,
                    b
                ))
                .filter(version => semver.gt(
                    version,
                    currentVersion
                ))
                .pop();

            if (nextVersion) {

                return {
                    currentVersion,
                    dependency,
                    nextVersion
                };

            }

            return false;

        } catch (err) {

            // Ignore error

        }

        return false;

    }))).filter(result => result);

};

module.exports = unityCheckUpdate;
