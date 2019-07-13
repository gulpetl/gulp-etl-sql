let gulp = require('gulp')
import {handlelines} from '../src/plugin'
export { handlelines, TransformCallback } from '../src/plugin';
import * as loglevel from 'loglevel'
const log = loglevel.getLogger('gulpfile')
log.setLevel((process.env.DEBUG_LEVEL || 'warn') as loglevel.LogLevelDesc)
import * as rename from 'gulp-rename'
const errorHandler = require('gulp-error-handle'); // handle all errors in one handler, but still stop the stream if there are errors

require('pkginfo')(module); // project package.json info into module.exports
const PLUGIN_NAME = module.exports.name;

// control the plugin's logging level separately from this 'gulpfile' logging
//const pluginLog = loglevel.getLogger(PLUGIN_NAME)
//pluginLog.setLevel('debug')


// allCaps makes sure all string properties on the top level of lineObj have values that are all caps
const allCaps = (lineObj: object): object => {
  log.debug(lineObj)
  for (let propName in lineObj) {
    let obj = (<any>lineObj)
    if (typeof (obj[propName]) == "string")
      obj[propName] = obj[propName].toUpperCase()
  }
  
  // for testing: cause an error
  // let err; 
  // let zz = (err as any).nothing;

  return lineObj
}

// ArraysTesting needs to return more than one record when processing certain lines, so returns an array of lines
const ArraysTesting = (lineObj: object): Array<object> | Object => {
  let lineObjArray
  let Obj:any = lineObj
  //introducing a 10% dicounted price for all mercedes cars
  if(Obj['type'] == "RECORD" && Obj['record']['carModel'] == "Mercedes") {
    let price:String = (Number(Obj['record']['price'])*90/100).toString()
    lineObjArray = [lineObj, {"type":"RECORD","stream":"Discount","record":{"Discounted Price":price}}]
    return lineObjArray // return an array in order to return multiple records from processing a single one
  } 
  return lineObj
}


function demonstrateHandlelines(callback: any) {
  log.info('gulp starting for ' + PLUGIN_NAME)
  return gulp.src('../testdata/*.ndjson',{buffer:false})
      .pipe(errorHandler(function(err:any) {
        log.error('oops: ' + err)
        callback(err)
      }))
      
      //FOR ARRAY TESTING
      //call ArraysTesting function above for each line
      .pipe(handlelines({}, { transformCallback: ArraysTesting }))

      // call allCaps function above for each line
      .pipe(handlelines({}, { transformCallback: allCaps }))
      // call the built-in handleline callback (by passing no callbacks to override the built-in default), which adds an extra param
      .pipe(handlelines({ propsToAdd: { extraParam: 1 } }))
      .pipe(rename({
        suffix: "-fixed",
      }))      
      .pipe(gulp.dest('../testdata/processed'))
      // .pipe(vinylPaths((path) => {
      //   // experimenting with deleting files, per https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md.
      //   // This actually deletes the NEW files, not the originals! Try gulp-revert-path
      //   return del(path, {force:true})
      // }))
      .on('end', function () {
        log.info('end')
        callback()
      })
    }


exports.default = demonstrateHandlelines