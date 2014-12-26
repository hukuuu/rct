#! /usr/bin/env node

var gulp = require('gulp');
var gutil = require('gulp-util');
var replace = require('gulp-replace');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var watchify = require('watchify');
var browserify = require('browserify');
var reactify = require('reactify');
var browserSync = require('browser-sync');
var argv = require('minimist')(process.argv.slice(2));

var basePath = require('path').join(__dirname) + '/';
var file = process.cwd() + '/' + (argv.f || argv.file)
var template = basePath + 'src/app_template.js'
var src = basePath + 'src/'
var appjs = src + 'app.js'
var dist = basePath + 'dist/'

// console.log(file);
// console.log(template);
// console.log(appjs);

gulp.task('inject', function() {
    return gulp.src(template)
        .pipe(replace(/replaceme/, 'require(\'' + file + '\')'))
        .pipe(rename('app.js'))
        .pipe(gulp.dest(src))
})

gulp.task('copy', function() {
    gulp.src('index.html')
        .pipe(gulp.dest(dist))
})

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: dist
        }
    });
});

gulp.task('watch', ['inject','copy'], function(done) {
    var bundler = watchify(browserify(appjs, watchify.args));
    bundler.transform(reactify);
    bundler.on('update', function() {
        bundle(browserSync.reload)
    });
    bundle(function() {
      gulp.start('browser-sync')  
    })

    function bundle(cb) {
        return bundler.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('bundle.js'))
            .pipe(gulp.dest(dist))
            .on('end', cb)
    }
})

gulp.start('watch')