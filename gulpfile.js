
const gulp = require('gulp')
const ts = require('gulp-typescript')
const sm = require('gulp-sourcemaps')
const project = ts.createProject('tsconfig.json')

gulp.task('default', () => {
    return project
        .src()
        .pipe(sm.init())
        .pipe(project())
        .pipe(sm.write('.', {
            sourceRoot: './',
            includeContent: false,
        }))
        .pipe(gulp.dest("dist"))
})
