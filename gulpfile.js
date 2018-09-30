var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var nunjucksRender = require('gulp-nunjucks-render');
var gulpData = require('gulp-data');

gulp.task('dir', function () {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./src'))
        .pipe(gulp.dest('./src/scss'))
        .pipe(gulp.dest('./src/img'))
        .pipe(gulp.dest('./src/js'))
        .pipe(gulp.dest('./src/templates'))
        .pipe(gulp.dest('./src/pages'));
});

gulp.task('styles', function () {
  return gulp.src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('nunjucks', function() {
    return gulp.src('src/pages/**/*.+(html|nunjucks)')
          .pipe(gulpData(function() {
            return require('./src/data.json')
           }))
          .pipe(nunjucksRender({
            path: ['src/templates']
          }))
          .pipe(gulp.dest('src'))
});

gulp.task('serve',function () {

    browserSync.init({
        server: {
            baseDir: 'src/'
        }
    });

    gulp.watch('src/scss/*.scss', ['styles']);
    gulp.watch(['src/**/*.html','src/img/*','src/js/*']).on('change', browserSync.reload);
    gulp.watch('src/templates/**/*.+(html|nunjucks)', ['nunjucks']).on('change', browserSync.reload);
    gulp.watch('src/pages/**/*.+(html|nunjucks)', ['nunjucks']).on('change', browserSync.reload);

});

gulp.task('default', ['styles', 'nunjucks', 'serve']);
