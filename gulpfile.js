const util = require('util');
const { series, src, dest, symlink } = require('gulp');
const watch = require('gulp-watch');
const {spawn} = require('child_process');
const del = require('del');

// from https://stackoverflow.com/a/50396702/682095
async function pipe(tap, sink) {
    return new Promise((resolve, reject) => {
        tap.pipe(sink, {end: false})
        tap.on("end", resolve)
        tap.on("error", reject)
    })
}

function spawnPromise(...args) {
    return new Promise(resolve => {
        const proc = spawn(...args);
        proc.on('close', resolve);
    });
};

function clean() {
    return del(['build/**/*']);
}

function npm() {
    return spawnPromise('npm', ['install', '--ignore-scripts'], {stdio: 'inherit', cwd: './build'});
}

async function setup() {
    await pipe(
        src('node_modules/semantic-ui/**/*'),
        dest('build/')
    );
    await pipe(
        src('theme/theme.config'),
        symlink('build/src/')
    );
    await pipe(
        src('theme/indico/**/*'),
        dest('build/themes/indico')
    );
    // These overrides are needed
    await pipe(
        src('build/src/themes/default/elements/{icon,divider,step}.overrides'),
        dest('build/themes/indico/elements/')
    );
    await pipe(
        src('build/src/themes/default/modules/{checkbox,dropdown,accordion}.overrides'),
        dest('build/themes/indico/modules/')
    );
     await pipe(
        src('semantic.json'),
        symlink('build/')
    );
}

function _build() {
    return spawnPromise('gulp', ['build'], {stdio: 'inherit', cwd: './build'});
}

async function _watch() {
    return watch('theme/**/*.{config,variables,overrides}', async () => {
        await _build();
    });
}

const build = series(setup, npm, _build);

exports.rebuild = series(clean, build);
exports.build = build
exports.watch = series(setup, npm, _watch);
exports.clean = clean;
exports.default = build;
