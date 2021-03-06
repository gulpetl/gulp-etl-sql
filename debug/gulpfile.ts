let gulp = require('gulp')
import {sql} from '../src/plugin'
import * as loglevel from 'loglevel'
const log = loglevel.getLogger('gulpfile')
log.setLevel((process.env.DEBUG_LEVEL || 'warn') as loglevel.LogLevelDesc)
const errorHandler = require('gulp-error-handle'); // handle all errors in one handler, but still stop the stream if there are errors

require('pkginfo')(module); // project package.json info into module.exports
const PLUGIN_NAME = module.exports.name;

// control the plugin's logging level separately from this 'gulpfile' logging
//const pluginLog = loglevel.getLogger(PLUGIN_NAME)
//pluginLog.setLevel('debug')


function runSQL(callback: any) {
  log.info('gulp starting for ' + PLUGIN_NAME)
  return gulp.src('../testdata/cars.ndjson',{buffer:true})
    .pipe(errorHandler(function(err:any) {
      log.error('oops: ' + err)
      callback(err)
    }))
    .on('data', function (file:any) {
      log.info('Starting processing on ' + file.basename)
    })  
    // .pipe(sql({includeWrapper:true, sql:'select record->carModel as carModel from ?'}))
    .pipe(sql({includeWrapper:false, sql:'select carModel as carModel from ?'}))
    .pipe(gulp.dest('../testdata/processed'))

    .on('end', function () {
      log.info('end')
      callback()
    })
}


exports.default = runSQL