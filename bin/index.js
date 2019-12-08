#!/usr/bin/env node

const {join} = require('path');

const table = require('text-table');

const chalk = require('chalk');
const meow = require('meow');

const updateNotifier = require('update-notifier');

const pkg = require('../package.json');

const unityCheckUpdates = require('../lib/unity-check-updates');
const updateDependencies = require('../lib/update-dependencies');

const cli = meow(
    `
      Usage
        $ ucu [options]
      Options
      ${chalk.yellow('--update, -u')}        Updated all packages to latest.
      ${chalk.yellow('--packageFile, -p')}   Package file path. (Default: Packages/manifest.json)
      ${chalk.yellow('--help, -h')}          Display this help message.
      ${chalk.yellow('--version, -v')}       Display the current installed version.
  `,
    {
        'flags': {
            'help': {
                'alias': 'h',
                'default': false,
                'type': 'boolean'
            },
            'packageFile': {
                'alias': 'p',
                'default': 'Packages/manifest.json',
                'type': 'string'
            },
            'update': {
                'alias': 'u',
                'default': false,
                'type': 'boolean'
            },
            'version': {
                'alias': 'v',
                'default': false,
                'type': 'boolean'
            }
        }
    }
);

updateNotifier({pkg}).notify();

(async () => {

    const path = join(
        process.cwd(),
        cli.flags.packageFile
    );

    process.stdout.write(`Checking ${path}\n\n`);

    const results = await unityCheckUpdates(path);

    if (results.length === 0) {

        process.stdout.write('All packages are up to date!');

        return;

    }

    const t = table([
        [
            'Package Name',
            'Version'
        ],
        [
            '============',
            '======='
        ],
        ...results.map(({currentVersion, dependency, nextVersion}) => [
            dependency,
            `${chalk.grey(currentVersion)} -> ${chalk.green(nextVersion)}`
        ])
    ]);

    process.stdout.write(`${t}\n\n`);

    if (cli.flags.update) {

        updateDependencies(
            path,
            results
        );

    } else {

        process.stdout.write(`Run ${chalk.blue('ucu -u')} to update all packages in manifest.json\n`);

    }

})();
