const dotenv = require('dotenv');
const { series, parallel, src, dest, watch } = require('gulp');
const stylus = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const gulpif = require('gulp-if');
const rev = require('gulp-rev');
const del = require('del');
const plumber = require('gulp-plumber');
const { rollup } = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

function clean() {
  return del(['public/css/**/*', 'public/js/**/*']);
}

function cleanJs() {
  return del['public/js/**/*'];
}

function css() {
  return (
    src(['assets/css/common.styl', 'assets/css/index.styl'])
      .pipe(plumber())
      .pipe(stylus())
      // .pipe(gulpif(isProd, rev()))
      // .pipe(gulpif(isProd, rev.manifest()))
      .pipe(dest('public/css'))
  );
}

async function js() {
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
}

exports.watch = function () {
  watch('assets/css/**/*.styl', css);
  watch('assets/js/**/*.js', js);
};
exports.default = series(clean, parallel(css, js));
