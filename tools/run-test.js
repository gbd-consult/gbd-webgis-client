const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const chromedriver = require('chromedriver');
const minimist = require('minimist');

async function exec(cmd, ...argv) {
    cmd = './node_modules/.bin/' + cmd;

    /*global Promise*/
    return new Promise(resolve => {

        let proc = cp.spawn(cmd, argv);

        proc.stdout.on('data', function (data) {
            process.stdout.write(String(data));
        });

        proc.stderr.on('data', function (data) {
            process.stdout.write(String(data));
        });

        proc.on('exit', function (code) {
            resolve(code);
        });
    })
}

async function runTask(task) {
    if (!task.running) {
        task.running = true;
        await exec('nightwatch', ...task.paths,
            '--env', task.type,
            task.verbose ? '--verbose' : '--');
        task.running = false;
    }
}

function createTasks(names, args) {
    let tasks = [];

    names.forEach(name => {
        let dir = path.resolve('./src', name.replace('core', 'node_modules'), 'test');
        if (!fs.existsSync(dir))
            return;

        let ls = fs.readdirSync(dir),
            fns;

        fns = ls.filter(f => f.match(/\bunit\.js$/));
        if (fns.length) {
            tasks.push({
                type: 'unit',
                paths: fns.map(f => path.resolve(dir, f)),
                verbose: args.verbose,
                name, dir
            });
        }

        fns = ls.filter(f => f.match(/\bfunc\.js$/));
        if (fns.length) {
            tasks.push({
                type: 'func',
                paths: fns.map(f => path.resolve(dir, f)),
                verbose: args.verbose,
                name, dir
            });
        }
    });

    return tasks;
}

function watcher(task, evt, fname) {
    if (task.timer)
        clearTimeout(task.timer);

    task.timer = setTimeout(
        async () => await runTask(task),
        100);
}

function start(args) {
    if (args.browser === 'chrome')
        chromedriver.start();
}

function stop(args) {
    if (args.browser === 'chrome')
        chromedriver.stop();
}

async function main(args) {

    let tasks = createTasks(args._, args);

    if (args.only)
        tasks = tasks.filter(t => t.type === args.only);

    if (!tasks.length)
        return;

    args.browser = tasks.some(t => t.type === 'func') ? (args.browser || 'chrome') : null;

    start(args);

    for (let t of tasks)
        await runTask(t);

    if (args.watch) {
        tasks.forEach(t => fs.watch(t.dir, (evt, fname) => watcher(t, evt, fname)));
        process.on('SIGINT', () => stop(args));
    } else {
        stop(args);
    }
}

main(minimist(process.argv.slice(2), {
    boolean: ['watch', 'verbose']
}));
