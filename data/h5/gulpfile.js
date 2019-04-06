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

gulp.task("devcss", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(mincss())
        .pipe(gulp.dest("./src/css/"))
})
gulp.task("watch", function() {
    gulp.watch("./src/scss/*.scss", gulp.series("devcss"))
})
gulp.task("webserver", function() {
    return gulp.src("./src/")
        .pipe(webserver({
            port: 3030,
            open: true,
            livereload: true,
            proxies: [{
                source: "/api/user",
                target: "http://localhost:3000/api/user"
            }, {
                source: "/api/bill",
                target: "http://localhost:3000/api/bill"
            }, {
                source: "/api/delete",
                target: "http://localhost:3000/api/delete"
            }, {
                source: "/api/refer",
                target: "http://localhost:3000/api/refer"
            }, {
                source: "/api/addation",
                target: "http://localhost:3000/api/addation"
            }, {
                source: "/api/increase",
                target: "http://localhost:3000/api/increase"
            }]
        }))
})
gulp.task("dev", gulp.series("devcss", "webserver", "watch"))