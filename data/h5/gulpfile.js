const gulp = require("gulp")
const htmlmin = require("gulp-htmlmin")
const mincss = require("gulp-clean-css")
const minjs = require("gulp-uglify")
const sass = require("gulp-sass")
const autoprefixer = require("gulp-autoprefixer")
const concat = require("gulp-concat")
const babel = require("gulp-babel")
const imagemin = require("gulp-imagemin")
const webserver = require("gulp-webserver")
gulp.task("devhtml", function() {
    return gulp.src("./src/*.html")
        .pipe(htmlmin({
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./dist/"))
})
gulp.task("devcss", function() {
    return gulp.src("./src/styles/*.scss")
        .pipe(sass())
        .pipe(mincss())
        .pipe(gulp.dest("./dist/styles/"))
})
gulp.task("devjs", function() {
    return gulp.src("./src/scripts/*.js")
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(minjs())
        .pipe(gulp.dest("./dist/scripts/"))
})
gulp.task("devimg", function() {
    return gulp.src("./src/img/*.{png,jpg}")
        .pipe(imagemin())
        .pipe(gulp.dest("./dist/img/"))
})
gulp.task("watch", function() {
    gulp.watch("./src/*.html", gulp.series("devhtml"))
    gulp.watch("./src/styles/*.scss", gulp.series("devcss"))
    gulp.watch("./src/scripts/*.js", gulp.series("devjs"))
    gulp.watch("./src/img/*.{png,jpg}", gulp.series("devimg"))
})
gulp.task("webserver", function() {
    return gulp.src("./dist/")
        .pipe(webserver({
            port: 3030,
            open: true,
            livereload: true
        }))
})
gulp.task("dev", gulp.series("devcss", "webserver", "watch"))