import program from 'commander';
import fs from 'fs';
import parser from './parser/parser';

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  //.option('-u, --upload [dir] [id]', 'Upload collection in directory [dir] to the cloud ([id])')
  .parse(process.argv);

console.log('rtfToHtml v' + program.version());
console.log('Converting "' + program.args[0] + '" -> "' + program.args[1] + '"');

fs.readFile(program.args[0], 'utf8', (err, data) => {
    console.log(data);
    const res = parser.parse(data);
    console.log(JSON.stringify(res, undefined, 2));
});
