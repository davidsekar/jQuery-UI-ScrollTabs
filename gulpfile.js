var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var typeScript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = typeScript.createProject("tsconfig.json");
var rimraf = require('rimraf');
var header = require('gulp-header');
var typedoc = require("gulp-typedoc");

var paths = {
  deps: ['deps/js/**/*.js', 'deps/css/**/*'],
  html: ['src/**/*.html'],
  scss: ['src/scss/**/*.scss'],
  ts: ['src/ts/**/*.ts'],
  typeDef: ['src/ts/**/*.d.ts'],
  docs: ['index.html', '.nojekyll', 'docs/**/*']
};

var dest = {
  root: 'dist/',
  js: 'dist/js',
  css: 'dist/css',
  typeDocOut: 'dist/docs/options'
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
  return gulp.src(paths.docs, {
      base: '.'
    })
    .pipe(gulp.dest(dest.root));
});

gulp.task("typedoc", function () {
  return gulp
    .src(paths.typeDef)
    .pipe(typedoc({
      // TypeScript options (see typescript docs)
      module: "commonjs",
      target: "es5",
      includeDeclarations: true,

      // Output options (see typedoc docs)
      out: dest.typeDocOut,
      excludeExternals: true,
      readme: 'none',
      mode: 'file',

      // TypeDoc options (see typedoc docs)
      name: pkg.name,
      theme: "minimal",
      ignoreCompilerErrors: false,
      version: true,
    }));
});

var taskList = ['copy-dependency', 'scss', 'ts', 'html', 'github-pages', 'typedoc'];

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('watch', taskList, function (done) {
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
  gulp.watch(paths.docs, ['github-pages']);
  gulp.watch(paths.typeDef, ['typedoc']);
});

gulp.task('deploy-files', taskList);

// use default task to launch Browsersync and watch JS files
gulp.task('default', taskList);
