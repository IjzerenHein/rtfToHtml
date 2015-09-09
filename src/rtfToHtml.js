import program from 'commander';
import fs from 'fs';
import parser from './parser/parser';
import htmlFormatter from './formatters/htmlFormatter';
import packageJson from '../package.json';

program
  .version(packageJson.version)
  .usage('[options] rtfFile htmlFile')
  //.option('-f, --format [format]', 'Output format [format]', 'html')
  .option('-m, --margins [top,right,left,bottom]', 'Override margins (twips)')
  .option('-w, --width [width]', 'Override paperwidth (twips)')
  .option('-h, --height [height]', 'Override paperheight (twips)')
  .option('-va, --vertalign [align]', '"top", "center", "bottom"')
  .parse(process.argv);

console.log('rtfToHtml v' + program.version());
const source = program.args[0];
const dest = program.args[1];
if (!source || !dest) {
    console.log('\nno source-file or destination-file specified');
    program.outputHelp();
}
else {
    console.log('Converting "' + source + '" -> "' + dest + '"');
    const options = {
        margins: [0, 0, 0, 0],
        vertAlign: 'top'
    };
    if (program.width) {
        options.width = program.width;
        console.log('--width ' + program.width);
    }
    if (program.height) {
        options.height = program.height;
        console.log('--height ' + program.height);
    }
    if (program.margins) {
        options.margins = JSON.parse(program.margins);
        console.log('--margins ' + program.margins);
    }
    if (program.vertalign) {
        options.vertAlign = program.vertalign;
        console.log('--vertalign ' + program.vertalign);
    }

    fs.readFile(source, 'utf8', (err, data) => {
        if (err) {
            return console.error(err);
        }
        const parsedRtf = parser.parse(data);
        console.log(JSON.stringify(parsedRtf, undefined, 2));
        const formatter = htmlFormatter;
        const output = formatter(parsedRtf, options);
        if (program.args.length >= 2) {
            fs.writeFile(dest, output, (err2) => {
                if (err2) {
                    console.log('ERROR: ' + err2);
                }
            });
        }
    });
}
