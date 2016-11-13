var gulp = require('gulp')
    , nodemon = require('gulp-nodemon')
    , babel = require('gulp-babel')
    , Cache = require('gulp-file-cache')
    , fs = require('fs')
    ,  pkg = require('./package.json');


var cache = new Cache();

gulp.task('compile', function () {
    gulp.src(['src/*/*', 'src/*' , 'src/*/*/*', 'src/*/*/*/*'])
        .pipe(gulp.dest('dist/'));

    delete pkg.devDependencies;
    pkg.scripts.start = "node bin/www";
    fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, '  '), 'utf-8');


    var babelfiles = {
        app: 'src/app.js',
        routes: 'src/routes',
        javascripts: 'src/public/javascripts',
        www: 'src/bin'
     }
    for (key in babelfiles){
        var stream = gulp.src(babelfiles[key])
            .pipe(cache.filter()) // remember files
            .pipe(babel()) // compile new ones
            .pipe(cache.cache()) // cache them
        switch (babelfiles[key]){
    case babelfiles.app:
        stream.pipe(gulp.dest('dist'))
        return stream
        break;
    case babelfiles.routes:
        stream.pipe(gulp.dest('dist/routes'))
        return stream
        break;
    case babelfiles.javascripts:
         stream.pipe(gulp.dest('dist/public/javascripts'))
         return stream
         break;
     case babelfiles.www:
        stream.pipe(gulp.dest('src/bin'))
        return stream
        break;
    }

}


})



gulp.task('watch', ['compile'], function () {
    var stream = nodemon({
        script: 'src/bin/www' // run ES5 code
        , watch: ['src', 'routes'] // watch ES2015 code
        , tasks: ['compile'] // compile synchronously onChange
    })

    return stream
})