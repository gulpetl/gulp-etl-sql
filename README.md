# gulp-etl-sql #

**gulp-etl-sql** runs SQL queries against a Message Stream. It is a wrapper for [alasql](https://www.npmjs.com/package/alasql), which uses a subset of standard SQL-99 plus additional syntax for handling schema-less data. Query results are returned as a Message Stream. Since the Message Stream must be fully loaded in order to be queried, only buffer mode is available.

This is a **[gulp-etl](https://gulpetl.com/)** plugin, and as such it is a [gulp](https://gulpjs.com/) plugin. **gulp-etl** plugins work with [ndjson](http://ndjson.org/) data streams/files which we call **Message Streams** and which are compliant with the [Singer specification](https://github.com/singer-io/getting-started/blob/master/docs/SPEC.md#output). Message Streams look like this:

```
{"type":"RECORD","stream":"cars","record":{"carModel":"Mercedes","price":"20000","color":"yellow"}}
{"type":"RECORD","stream":"cars","record":{"carModel":"Audi","price":"10000","color":"blue"}}
{"type":"RECORD","stream":"cars","record":{"carModel":"BMW","price":"15000","color":"red"}}
{"type":"RECORD","stream":"cars","record":{"carModel":"Porsche","price":"30000","color":"green"}}
```

### Usage
**gulp-etl** plugins accept a configObj as its first parameter. The configObj
will contain any info the plugin needs.

- `sql : string` The SQL code to be executed
    - example:  ``{sql: 'select carModel, price, color from ?'}``
- `includeWrapper : boolean = false` If true, includes the entire record wrapper as the incoming data
    - example: ``{includeWrapper: true, sql: 'select type, stream, record from ?'}``

The simplest query takes all RECORD lines record objects as a table (referenced as '?'), as in the exmples above.

Also, note the usage of the "property" (`->`) [operator](https://github.com/agershun/alasql/wiki/Operators) to access nested data:

```
{includeWrapper: true, sql: 'select type, stream, record->carModel, record->price, record->color from ?'}
```


##### Sample gulpfile.js
```
var sql = require('gulp-etl-sql').sql
// for TypeScript use this line instead:
// import { sql } from 'gulp-etl-sql'

exports.default = function() {
    return src('data/*.ndjson')
    .pipe(sql({sql:'select * from ?'}))
    .pipe(dest('output/'));
}
```

### Quick Start for Coding on this Plugin
* Dependencies: 
    * [git](https://git-scm.com/downloads)
    * [nodejs](https://nodejs.org/en/download/releases/) - At least v6.3 (6.9 for Windows) required for TypeScript debugging
    * npm (installs with Node)
    * typescript - installed as a development dependency
* Clone this repo and run `npm install` to install npm packages
* Debug: with [VScode](https://code.visualstudio.com/download) use `Open Folder` to open the project folder, then hit F5 to debug. This runs without compiling to javascript using [ts-node](https://www.npmjs.com/package/ts-node)
* Test: `npm test` or `npm t`
* Compile to javascript: `npm run build`

### Testing

We are using [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) for our testing. Each of our tests are in the `test` folder.

- Run `npm test` to run the test suites



Note: This document is written in [Markdown](https://daringfireball.net/projects/markdown/). We like to use [Typora](https://typora.io/) and [Markdown Preview Plus](https://chrome.google.com/webstore/detail/markdown-preview-plus/febilkbfcbhebfnokafefeacimjdckgl?hl=en-US) for our Markdown work..
