import program from 'commander';
import fs from 'fs';
import parser from './parser/parser';
import htmlFormatter from './formatters/htmlFormatter';

program
  .version('0.0.1')
  .usage('[options] file [outputFile]')
  .option('-f, --format [format]', 'Output format [format]', 'html')
  .parse(process.argv);

console.log('rtfToHtml v' + program.version());
console.log('Converting "' + program.args[0] + '" -> "' + program.args[1] + '"');

fs.readFile(program.args[0], 'utf8', (err, data) => {
    //console.log(data);
    const parsedRtf = parser.parse(data);
    console.log(JSON.stringify(parsedRtf, undefined, 2));
    const formatter = htmlFormatter;
    const output = formatter(parsedRtf);
    //console.log(output);
    if (program.args.length >= 2) {
        fs.writeFile(program.args[1], output, (err) => {
            if (err) {
                console.log('ERROR: ' + err);
            }
        });
    }
});
