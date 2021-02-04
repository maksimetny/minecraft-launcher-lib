
const gulp = require('gulp')
const ts = require('gulp-typescript')
const sm = require('gulp-sourcemaps')
const fs = require('fs-extra')
const project = ts.createProject('tsconfig.json')
const babel = require('gulp-babel')
const merge = require('merge2')

gulp.task('build', () => {
    const result = project
        .src()
        .pipe(sm.init())
        .pipe(project())
    return merge([
        result
            .js
            .pipe(babel()),
        result
            .dts,
    ])
        .pipe(sm.write('.', { sourceRoot: './', includeContent: false }))
        .pipe(gulp.dest('dist'))
})

gulp.task('clean', async done => {
    await fs.emptyDir('dist')
    done()
})

gulp.task('default', gulp.series('clean', 'build'))
