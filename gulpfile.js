var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var typeScript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = typeScript.createProject("tsconfig.json");


var paths = {
  html: ['index.html'],
  scss: ['scss/**/*.scss'],
  ts: ['ts/**/*.ts'],
};

var dest = {
  js: 'js',
  css: 'css'
};

function refreshBrowserSync(done) {
  browserSync.reload();
  done();
}

gulp.task('ts', function () {
  return tsProject.src()
    // .pipe(sourcemaps.init())
    .pipe(tsProject()).js
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dest.js));
});

gulp.task('ts-watch', ['ts'], refreshBrowserSync);

gulp.task('html-watch', [], refreshBrowserSync);

gulp.task('scss', function () {
  return gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest.css));
});

gulp.task('scss-watch', ['scss'], refreshBrowserSync);

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('watch', ['scss', 'ts'], function (done) {
  // Serve files from the root of this project
  browserSync.init({
    ui: {
      port: 8080
    },
    server: {
      baseDir: "./"
    }
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch(paths.ts, ['ts-watch']);
  gulp.watch(paths.scss, ['scss-watch']);
  gulp.watch(paths.html, ['html-watch']);
});

// use default task to launch Browsersync and watch JS files
gulp.task('default', ['scss', 'ts']);
