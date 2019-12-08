const {readFileSync, writeFileSync} = require('fs');

const {EOL} = require('os');

const JSON_TAB_WIDTH = 2;

const updateDependencies = (path, dependencies) => {

    const manifest = JSON.parse(readFileSync(
        path,
        'utf8'
    ));

    dependencies.forEach(({dependency, nextVersion}) => {

        manifest.dependencies[dependency] = nextVersion;

    });

    writeFileSync(
        path,
        `${JSON.stringify(
            manifest,
            null,
            JSON_TAB_WIDTH
        )}${EOL}`
    );

};

module.exports = updateDependencies;
