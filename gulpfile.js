const gulp = require('gulp');
const pump = require('pump');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

gulp.task('compressCss', () =>
    gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(cssmin())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest('dist/css'))
);

gulp.task('compressJs', function (cb) {
  pump([
        gulp.src('src/js/*.js'),
        gulp.dest('dist/js'),
        uglify(),
        rename("main.min.js"),
        gulp.dest('dist/js')
    ],
    cb
  );
});

gulp.task('compressImgs', () =>
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);
