var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var typeScript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = typeScript.createProject("tsconfig.json");
var rimraf = require('rimraf');
var header = require('gulp-header');

var paths = {
  deps: ['deps/js/**/*.js', 'deps/css/**/*'],
  html: ['src/**/*.html', 'index.html'],
  scss: ['src/scss/**/*.scss'],
  ts: ['src/ts/**/*.ts'],
};

var dest = {
  root: 'dist/',
  js: 'dist/js',
  css: 'dist/css'
};

function refreshBrowserSync(done) {
  browserSync.reload();
  done();
}
// using data from package.json
var pkg = require('./package.json');
var banner = ['/*! <%= pkg.name %>',
  ' * v<%= pkg.version %>',
  ' * <%= pkg.homepage %>',
  ' * @license <%= pkg.license %> */\n'
].join(' | ');

gulp.task('ts', function () {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject()).js
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest.js));
});

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(dest.root));
});

gulp.task('ts-watch', ['ts'], refreshBrowserSync);

gulp.task('html-watch', ['html'], refreshBrowserSync);

gulp.task('scss', function () {
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest.css));
});

gulp.task('scss-watch', ['scss'], refreshBrowserSync);

gulp.task('copy-dependency', function () {
  return gulp.src(paths.deps, {
      base: './deps'
    })
    .pipe(gulp.dest(dest.root));
});

gulp.task('clean', function () {
  return rimraf('dist/**', function () {
    // console.log('completed');
  });
});

gulp.task('github-pages', function () {
  return gulp.src(['index.html', 'docs/**/*'], {
      base: '.'
    })
    .pipe(gulp.dest(dest.root));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('watch', ['copy-dependency', 'html', 'scss', 'ts', 'github-pages'], function (done) {
  // Serve files from the root of this project
  browserSync.init({
    ui: {
      port: 8080
    },
    server: {
      baseDir: "./dist",
      index: "index.html"
    }
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch(paths.ts, ['ts-watch']);
  gulp.watch(paths.scss, ['scss-watch']);
  gulp.watch(paths.html, ['html-watch']);
});

gulp.task('deploy-files', ['copy-dependency', 'scss', 'ts', 'html', 'github-pages'])

// use default task to launch Browsersync and watch JS files
gulp.task('default', ['copy-dependency', 'scss', 'ts', 'html']);
