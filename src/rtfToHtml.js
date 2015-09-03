import program from 'commander';
import fs from 'fs';
import parser from './parser/parser';
import htmlFormatter from './formatters/htmlFormatter';

program
  .version('0.0.1')
  .usage('[options] file [outputFile]')
  .option('-f, --format [format]', 'Output format [format]', 'html')
  .option('-m, --margins [top, right, left, bottom]', 'Margins')
  .option('-w, --width [width]', 'Width')
  .option('-h, --height [height]', 'Height')
  .option('-va, --vertalign [align]', 'Vertical alignment', 'top/center/bottom')
  .parse(process.argv);

console.log('rtfToHtml v' + program.version());
console.log('Converting "' + program.args[0] + '" -> "' + program.args[1] + '"');
const options = {
    margins: [0, 0, 0, 0],
    vertAlign: 'top'
};
if (program.width) {
    options.width = program.width;
    console.log('--width ' + program.width)
}
if (program.height) {
    options.height = program.height;
    console.log('--height ' + program.height)
}
if (program.margins) {
    options.margins = JSON.parse(program.margins);
    console.log('--margins ' + program.margins)
}
if (program.vertalign) {
    options.vertAlign = program.vertalign;
    console.log('--vertalign ' + program.vertalign)
}

fs.readFile(program.args[0], 'utf8', (err, data) => {
    //console.log(data);
    const parsedRtf = parser.parse(data);
    console.log(JSON.stringify(parsedRtf, undefined, 2));
    const formatter = htmlFormatter;
    const output = formatter(parsedRtf, options);
    if (program.args.length >= 2) {
        fs.writeFile(program.args[1], output, (err) => {
            if (err) {
                console.log('ERROR: ' + err);
            }
        });
    }
});
