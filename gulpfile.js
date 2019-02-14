// gulp core packages
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    handlebars = require('gulp-handlebars'),
    declare = require('gulp-declare'),
    wrap = require('gulp-wrap'),
    zip = require('gulp-zip'),
    del = require('del');

// handlebars
var hbs = require('handlebars');

// image compression
var imagemin = require('gulp-imagemin'),
    imageminPNGquant = require('imagemin-pngquant'),
    imageminJPEGrecompress = require('imagemin-jpeg-recompress');

// file paths
var paths = {
    src: {
        css: './public/src/css',
        sass: './public/src/scss',
        js: './public/src/js',
        tpl: './public/src/templates',
        img: './public/src/images'
    },
    dist: {
        css: './public/dist/css',
        sass: './public/dist/css',
        js: './public/dist/js',
        img: './public/dist/images'
    }
};

// css
gulp.task('css', function () {
    console.log('starting css...');

    return gulp.src([
        paths.src.css + '/reset.css',
        paths.src.css + '/app.css',
        paths.src.css + '/**/*.css'
    ]) // sort css when compiling
        .pipe(plumber(function (error) {
            console.log('css error...', error);
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(concat('app.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.css))
        .pipe(livereload());
});

// sass
gulp.task('sass', function () {
    console.log('starting sass...');

    return gulp.src(paths.src.sass + '/app.scss')
        .pipe(plumber(function (error) { // escape error and allow gulp to continue running
            console.log('sass error...', error);
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(sass({
            outputStyle: 'compressed'
        }))

        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.css))
        .pipe(livereload());
});

// js
gulp.task('js', function () {
    console.log('starting js...');

    return gulp.src(paths.src.js + '/**/*.js')
        .pipe(plumber(function (error) { // escape error and allow gulp to continue running
            console.log('js error...', error);
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.js))
        .pipe(livereload());
});

// images
gulp.task('images', function () {
    console.log('starting images...');

    return gulp.src(paths.src.img + '/**/*.{png,jpeg,jpg,svg,gif}') // filter extensions
        .pipe(imagemin([
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo(),
            imageminPNGquant(),
            imageminJPEGrecompress()
        ]))
        .pipe(gulp.dest(paths.dist.img));
});

// templates
gulp.task('templates', function () {
    console.log('starting templates...');

    return gulp.src(paths.src.tpl + '/**/*.hbs')
        .pipe(handlebars({
            handlebars: hbs
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'templates',
            noRedeclare: true // prevent gulp from redefining that already exists
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(livereload());
});

// initialize server
gulp.task('serve', function (done) {
    console.log('starting server...');

    require('./server');

    livereload.listen();

    done();
});

// remove dist folder
gulp.task('clean', function (done) {
    console.log('starting clean...');

    del.sync('./public/dist');

    done();
});

// initialize gulp default
gulp.task('default', gulp.series(['clean', 'images', 'templates', 'sass', 'js', 'serve']), function (done) {
    console.log('starting default...');

    done();
});

// create zip file
gulp.task('export', function () {
    console.log('starting export...');

    return gulp.src('./public/**/*')
        .pipe(zip('basic-gulp-website.zip'))
        .pipe(gulp.dest('./'));
});

// watch files
gulp.task('watch', gulp.series('default', function () {
    console.log('starting watch...');

    gulp.watch(paths.src.css + '/**/*.css', gulp.series('css'));
    gulp.watch(paths.src.sass + '/**/*.scss', gulp.series('sass'));
    gulp.watch(paths.src.js + '/**/*.js', gulp.series('js'));
    gulp.watch(paths.src.tpl + '/**/*.hbs', gulp.series('templates'));
}));
