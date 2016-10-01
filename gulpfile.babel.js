'use strict';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src([
    'src/**/*.js',
    '!src/**/lib'
  ])
  .pipe($.eslint())
  .pipe($.eslint.format())
  .pipe($.if(!browserSync.active, $.eslint.failOnError()))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    '> 1%',
    'last 2 versions'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'src/**/*.scss',
    '!src/**/lib'
  ])
  .pipe($.sass({
    precision: 10
  })
  .on('error', $.sass.logError))
  .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
  .pipe(gulp.dest(function(file) {
    return file.base;
  }));
});

// Watch files for changes & reload
gulp.task('serve', ['styles'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'Lab',
    // Serve files from the current directory
    server: {
      baseDir: 'src'
    },
    directory: true,
    // https: true,
    // open: false,
    port: 3000
  });

  gulp.watch(['src/**/*.html'], reload);
  gulp.watch(['src/**/*.scss'], ['styles', reload]);
  gulp.watch(['src/**/*.js'], ['lint', reload]);
});
