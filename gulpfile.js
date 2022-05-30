var gulp = require('gulp');
var GulpSSH = require('gulp-ssh');
var config = require('./config/config').ssh;
const staticPath = '/service/veln/ui/veln-ui';

const getGulpSSH = (env) => {
    return new GulpSSH({
        ignoreErrors: false,
        sshConfig: config[env]
    });
};

gulp.task('test-clean', function () {
    return getGulpSSH('test').shell(`rm -rf ${staticPath}`);
});

gulp.task('yufa-clean', function () {
    return getGulpSSH('yufa').shell(`rm -rf ${staticPath}`);
});

gulp.task('prod-clean', function () {
    return getGulpSSH('prod').shell(`rm -rf ${staticPath}`);
});

gulp.task('push-to-test', gulp.series('test-clean', function () {
    return gulp
        .src(['./dist/**'])
        .pipe(getGulpSSH('test').dest(staticPath));
}));

gulp.task('push-to-yufa', gulp.series('yufa-clean', function () {
    return gulp
        .src(['./dist/**'])
        .pipe(getGulpSSH('yufa').dest(staticPath));
}));

gulp.task('push-to-prod', gulp.series('prod-clean', function () {
    return gulp
        .src(['./dist/**'])
        .pipe(getGulpSSH('prod').dest(staticPath));
}));
