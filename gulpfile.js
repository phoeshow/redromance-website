const dotenv = require('dotenv');
const { series, parallel, src, dest, watch, lastRun } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const gulpif = require('gulp-if');
const rev = require('gulp-rev');
const del = require('del');
const plumber = require('gulp-plumber');
const { rollup } = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const gulpBabel = require('gulp-babel');
const nodemon = require('nodemon');
const autoPrefixer = require('gulp-autoprefixer');

dotenv.config();

function clean() {
  return del(['public/css/**/*', 'public/js/**/*']);
}

const taskStyle = () => {
  return src(['assets/scss/index.scss'])
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer())
    .pipe(dest('public/css'));
};

const taskServerApp = async () => {
  return src('src/**', { since: lastRun(taskServerApp) })
    .pipe(gulpBabel({ presets: ['@babel/env'] }))
    .pipe(dest('dist'));
};

const taskClientApp = async () => {
  const bundle = await rollup({
    input: 'assets/js/index.js',
    plugins: [nodeResolve(), babel({ babelHelpers: 'bundled' })],
  });

  await Promise.all([
    bundle.write({
      file: 'public/js/bundle.js',
      format: 'umd',
      name: 'bundle',
    }),
    bundle.write({
      file: 'public/js/bundle.min.js',
      format: 'umd',
      name: 'bundle',
      plugins: [terser()],
    }),
  ]);
};

const taskDev = async () => {
  // 清空编译文件夹
  clean();

  nodemon({
    restartable: 'rs',
    watch: ['dist/', 'views/'],
    exec: 'node dist/index.js',
    ext: 'js, pug',
  });

  nodemon
    .on('start', function () {
      console.log('App has started');
    })
    .on('quit', function () {
      console.log('App has quit');
      process.exit();
    })
    .on('restart', function (files) {
      console.log('App restarted due to: ', files);
    });
  // 前端样式文件
  watch('assets/scss/**/*.scss', { ignoreInitial: false }, taskStyle);
  // 前端脚本文件
  watch('assets/js/**/*.js', { ignoreInitial: false }, taskClientApp);
  // 服务端程序
  watch(['src/**', '!src/**/*.md'], { ignoreInitial: false }, taskServerApp);
};

exports.watch = taskDev;

exports.taskServerApp = taskServerApp;

exports.default = series(
  clean,
  parallel(taskClientApp, taskServerApp, taskStyle)
);
