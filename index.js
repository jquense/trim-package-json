var fs = require('fs')
var path = require('path');
var mkdirp = require('mkdirp')
var omit = require('lodash/omit')

var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .option('main', {
    alias: 'm',
    describe: 'Specify a new "main" field for the generated package.json'
  })
  .option('scripts', {
    alias: 's',
    default: false,
    describe: 'Include scripts in the generated package.json'
  })
  .demand(1, 2, 'Provide a package.json destination, or source and destination')
  .argv

var positional = argv._;

var src, dest;

if (positional.length === 1) {
  src = process.cwd()
  dest = positional[0]
}
else if (positional.length >= 2) {
  src = positional[0]
  dest = positional[1]
}

if (path.normalize(src) === path.normalize(dest)) {
  throw new Error('The destination is the same local as the original package.json!')
}

var pkg = require(path.join(src, 'package.json'))
var nextPkg = omit(pkg, 'files', 'scripts', 'devDependencies')

if (argv.scripts) {
  nextPkg.scripts = pkg.scripts
}

if (argv.main) {
  nextPkg.main = argv.main
}

mkdirp(dest, function(err) {
  if (err) throw err;

  fs.writeFile(
      path.join(dest, 'package.json')
    , JSON.stringify(nextPkg, null, 2) + '\n'
    , function (err) {
    if (err) throw err;
  });
})
