var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

var embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;


var server = express();
server.use(livereload({port: livereloadport}));
server.use(express.static('./dist'));

server.all('/*', function(req, res){
    res.sendfile('index.html', {root: 'dist'});
});

gulp.task('lint', function(){
    gulp.src('./app/scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('browserify', function(){
    gulp.src(['app/scripts/main.js'])
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('views', function(){
    gulp.src('app/index.html')
        .pipe(gulp.dest('dist/'))
        .pipe(refresh(lrserver));

    gulp.src('./app/views/**/*')
        .pipe(gulp.dest('dist/views/'))
        .pipe(refresh(lrserver));
});

gulp.task('styles', function(){
    gulp.src('app/styles/*.scss')
        .pipe(sass({onError: function(e) {console.log(e); }}))
        .pipe(autoprefixer("last 2 versions", "> %1", "ie 8"))
        .pipe(gulp.dest('dist/css'))
        .pipe(refresh(lrserver));
})


gulp.task('watch', ['lint'], function(){

    gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'], [
        'lint',
        'browserify'
    ]);

    gulp.watch(['app/index.html', 'app/views/**/*.html'], [
        'views'
    ]);

    gulp.watch(['app/styles/**/*.scss'], [
        'styles'
    ])
});

gulp.task('dev', function(){
    server.listen(serverport);
    lrserver.listen(livereloadport);
    gulp.run('watch');
});