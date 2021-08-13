
const gulp = require('gulp');
const ts = require('gulp-typescript');
const sm = require('gulp-sourcemaps');
const es = require('gulp-eslint');
const fs = require('fs-extra');
const babel = require('gulp-babel');
const merge = require('merge2');

const project = ts.createProject('tsconfig.json');

gulp.task('lint', () => {
    return project
        .src()
        .pipe(es())
        .pipe(es.format())
        .pipe(es.failAfterError());
});

gulp.task('build', () => {
    const result = project
        .src()
        .pipe(sm.init())
        .pipe(project());
    return merge([
        result
            .js
            .pipe(babel()),
        result
            .dts,
    ])
        .pipe(sm.write('.', { sourceRoot: './', includeContent: false }))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', async done => {
    await fs.emptyDir('dist');
    done();
});

gulp.task('default', gulp.series('clean', 'build'));
