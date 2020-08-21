var gulp = require("gulp");
var shell = require("gulp-shell");
var browserSync = require("browser-sync").create();

// Task for building blog when something changed:
gulp.task(
  "build",
  shell.task([
    "bundle exec jekyll serve --watch --incremental --config _config-dev.yml",
  ])
);
// If you don't use bundle:
// gulp.task('build', shell.task(['jekyll serve']));
// If you use  Windows Subsystem for Linux (thanks @SamuliAlajarvela):
// gulp.task('build', shell.task(['bundle exec jekyll serve --force_polling']));

// Task for serving blog with Browsersync
gulp.task("serve", function () {
  browserSync.init({ server: { baseDir: "_site/" }, open: false });
  // Reloads page when some of the already built files changed:
  gulp.watch("_site/**/*.*").on("change", browserSync.reload);
});

gulp.task("default", gulp.parallel(["build", "serve"]));
