// ПОДКЛЮЧЕНИЕ НЕОБХОДИМЫХ ПАКЕТОВ

var gulp         = require('gulp'), // Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет - перегоняет sass в css,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync - запускает сервер и делает на нем LiveReload
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для сжатия изображений
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
    gutil        = require('gulp-util');


var spritesmith = require('gulp.spritesmith');//спрайт
var csscomb = require('gulp-csscomb'); //расческа


// можно в командной строке выполнить таск напрямую - gulp Имя таска


// Создаем таск "sass" - он перегоняет sass|scss файлы в css

gulp.task('sass', function(){ 
    return gulp.src('app/sass/**/*.+(scss|sass)') // Берем все scss или sass файлы из папки sass и дочерних, если таковые будут
            .pipe(sass().on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass, при ошибке сообщение
            .pipe(gulp.dest('app/css'))// Выгружаем результата в папку app/css
            .on('error', sass.logError)
            .pipe(browserSync.reload({stream: true}));// так как теперь css изменился то обновим его для страницы - чтобы работал LiveReload
});


// Создаем таск browser-sync - для LiveReload
gulp.task('browser-sync', function() {
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

// ТАСК СЖИМАЕТ CSS файл(libs.css) И ДОБАВЛЯЕТ .min в названии
gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем файлу суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

// Создаем задачу для сборки и сжатия всех JS библиотек
gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        // 'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
        // 'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js' // Берем Magnific Popup
    ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});


// ПРИЧЕСЫВАЕТ CSS (csscomb)
gulp.task('styles', ['stylesass'], function() {
    return gulp.src('app/css/main.css')
        .pipe(csscomb().on('error', function (e) {
            gutil.log(gutil.colors.red(e.message));
            this.emit('end');
        }))
        .pipe(gulp.dest('app/css'));
});

// ПРИЧЕСЫВАЕТ Sass (csscomb)
gulp.task('stylesass', function() {
    return gulp.src('app/sass/main.scss')
        .pipe(csscomb().on('error', function (e) {
            gutil.log(gutil.colors.red(e.message));
            this.emit('end');
        }))
        .pipe(gulp.dest('app/sass'));
});


// ДЕЛАЕТ СПРАЙТ
gulp.task('sprite', function () {
    var spriteData = gulp.src(['app/img/spr/*.*'],{
        dot: true //чтобы брались файлы начиниающиеся с точки
        })
        .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss', 
        padding:30,
        algorithm: 'top-down'
    }));
    // return spriteData.pipe(gulp.dest('app/img/sprite/'));
    spriteData.img.pipe(gulp.dest('app/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('app/sass/'));
});


// ТАСК WATCH - массив между watch и function - те таски которые будут выполнены перед запуском таска watch
gulp.task('watch',['browser-sync','sass','css-libs', 'scripts', 'styles'], function() {
    gulp.watch('app/sass/**/*.+(scss|sass)', ['sass','stylesass']); // Наблюдение за scss|sass файлами и в случае их изменения вызов таска sass
    // Наблюдение за другими типами файлов
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
});

// ===================================================================
// ТАСКИ ДЛЯ ПРОДАКШЕН ВЕРСИИ

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

//сжимает все изображения
gulp.task('img', function() {
    return gulp.src('app/img/*.+(png|jpg|gif)') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

//СОЗДАЕТ АВТОПРЕФИКСЫ
gulp.task('autoprefixer',function(){
    return gulp.src(['app/css/main.css', 'app/css/libs.min.css'])
            .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
            .pipe(gulp.dest('app/css'))
});

// ЗАПУСКАТЬ ТАСК build
gulp.task('build', ['autoprefixer','clean', 'img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/main.css',
        'app/css/libs.min.css'
    ])
        .pipe(gulp.dest('dist/css'));
    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});

// ДЛЯ ТОГО ЧТОБЫ ОЧИСИТИТЬ КЭШ GULP'a
gulp.task('clear', function (callback) {
    return cache.clearAll();
});