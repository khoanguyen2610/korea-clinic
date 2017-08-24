// including plugins
var timestamp = Date.now();
var gulp = require('gulp')
, uglify = require('gulp-uglify')
, replace = require('gulp-replace')
, concat = require('gulp-concat')
, concatCss = require('gulp-concat-css');


 
// compress file js after angular cli build
gulp.task('minify-js', function () {
    gulp.src('dist/*.js')
	    .pipe(uglify())
	    .pipe(gulp.dest('dist'));
});

//add timestamp to clear cache browser
gulp.task('timestamp-html', function(){
  	gulp.src(['dist/index.html'])
	    .pipe(replace(/(\?t=.*")/g, '"'))
	    .pipe(replace(/(\.css)/g, '$1\?t=' + timestamp))
	    .pipe(replace(/(\.js)/g, '$1\?t=' + timestamp))
	    .pipe(gulp.dest('dist'));
});

//add timestamp to clear cache browser file chunk.js - lazyloading angular.io
gulp.task('timestamp-lazyloading', function(){
  	gulp.src(['dist/inline.bundle.js'])
	    .pipe(replace(/(\?t=.*")/g, '"'))
	    .pipe(replace(/(\.chunk\.js)/g, '$1\?t=' + timestamp))
	    .pipe(gulp.dest('dist'));
});

//add concat file JS
var arrJS = ['dist/assets/js/detect_browser.js', 'dist/assets/plugins/system.js', 
			'dist/assets/plugins/jquery-3.1.1/jquery-3.1.1.min.js', 'dist/assets/plugins/bootstrap-3.3.7-dist/js/bootstrap.min.js', 
			'dist/assets/plugins/datatables-1.10.12/js/jquery.dataTables.min.js', 'dist/assets/plugins/moment/moment.min.js', 
			'dist/assets/plugins/moment/moment-with-locales.min.js', 'dist/assets/plugins/datetimepicker/js/bootstrap-datetimepicker.min.js', 
			'dist/assets/plugins/ng2-bs3-modal.min.js', 'dist/assets/plugins/jqueryui/jquery-ui.min.js', 
			'dist/assets/plugins/formBuilder/form-builder.js', 'dist/assets/plugins/ckeditor/ckeditor.js', 
			'dist/assets/plugins/jquery-ui-1.12.1/jquery-ui.min.js', 'dist/assets/plugins/mcustomscrollbar/jquery.mCustomScrollbar.concat.min.js', 
			'dist/assets/plugins/matchheight/jquery.matchheight.js', 'dist/assets/plugins/jquery.timepicker.js', 
			'dist/assets/plugins/cleave.min.js', 'dist/assets/plugins/sweetalert2/sweetalert2.js', 
			'dist/assets/js/script.js',

			'dist/inline.bundle.js',
			'dist/polyfills.bundle.js',
			'dist/styles.bundle.js',
			'dist/vendor.bundle.js',
			'dist/main.bundle.js'
			];
gulp.task('concat-script', function() {
  return gulp.src(arrJS)
    .pipe(concat('bundle.js', {newLine: ';'}))
    .pipe(gulp.dest('./dist/'));
});

//add concat file CSS
var arrCSS = ['dist/assets/plugins/bootstrap-3.3.7-dist/css/bootstrap.min.css', 'dist/assets/fonts/icons/font-awesome-4.7.0/css/font-awesome.min.css', 
			'dist/assets/fonts/icons/icomoon/styles.css', 'dist/assets/plugins/datatables-1.10.12/css/jquery.dataTables.min.css', 
			'dist/assets/plugins/datetimepicker/css/bootstrap-datetimepicker.min.css', 'dist/assets/plugins/toaster.css', 
			'dist/assets/plugins/jquery.timepicker.css' , 'dist/assets/plugins/formBuilder/form-builder.css' , 
			'dist/assets/plugins/jquery-ui-1.12.1/jquery-ui.css', 'dist/assets/plugins/mcustomscrollbar/jquery.mCustomScrollbar.css', 
			'dist/assets/css/progress-bar.css', 'dist/assets/plugins/sweetalert2/sweetalert2.min.css', 
			'dist/assets/css/reset.css', 'dist/assets/css/style.css'
			];

gulp.task('concat-css', function () {
  return gulp.src(arrCSS)
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('./dist/'));
});




//Total task
gulp.task('default', ['minify-js', 'timestamp-html', 'timestamp-lazyloading']);