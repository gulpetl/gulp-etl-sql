const through2 = require('through2')
import Vinyl = require('vinyl')
import PluginError = require('plugin-error');
require('pkginfo')(module); // project package.json info into module.exports
const PLUGIN_NAME = module.exports.name;
import * as loglevel from 'loglevel'
import * as alasql from 'alasql'
import * as transformJson from 'gulp-etl-transform-json'

const log = loglevel.getLogger(PLUGIN_NAME) // get a logger instance based on the project name
log.setLevel((process.env.DEBUG_LEVEL || 'warn') as loglevel.LogLevelDesc)

/* This is a model gulp-etl plugin. It is compliant with best practices for Gulp plugins (see
https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md#what-does-a-good-plugin-look-like ),
but with an additional feature: it accepts a configObj as its first parameter */
export function query(configObj?: any) {


  // creating a stream through which each file will pass
  // see https://stackoverflow.com/a/52432089/5578474 for a note on the "this" param
  const strm = through2.obj(function (this: any, file: Vinyl, encoding: string, cb: Function) {
    const self = this
    let returnErr: any = null

    try {    
      if (file.isNull()) {
        // return empty file
        return cb(returnErr, file)
      }
      else if (file.isBuffer()) {
        const data = JSON.parse((file.contents as Buffer).toString())
        // let res = alasql('select * from ? where record.carModel = "Audi"', [data]) // causes error
        // let res = alasql('select record from ? where carModel = "Audi"', [data])
        // let res = alasql('select * from ?', [data]) 
        let res = alasql(configObj.sql, [data])

        res = JSON.stringify(res)
        log.debug(res)
        file.contents = Buffer.from(res)

        // send the transformed file through to the next gulp plugin, and tell the stream engine that we're done with this file
        cb(returnErr, file)
      }
      else if (file.isStream()) {
        cb(new PluginError(PLUGIN_NAME, 'Stream mode not available. Run in buffer mode instead: gulp.src(... ,{buffer: true})'))
      }
    }
    catch(err) {
      self.emit('error', new PluginError(PLUGIN_NAME, err))
    }

  })

  // startHandler();

  return strm
  // .pipe(transformJson.tapJson({changeMap:true}));

  // return transformJson.targetJson({changeMap:true,mapFullStreamObj:false})
  // .pipe(strm)
  // .pipe(transformJson.tapJson({changeMap:false}))
}