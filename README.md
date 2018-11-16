# rtfToHtml

Converts RTF files into HTML.

This tool has been developed to convert RTF output from Adobe InDesign into
(almost) pixel perfect formatted HTML output.

It supports the following features:
- newline (/par)
- tabs (/tab)
- right-aligned tabs (/tqr)
- tab-stops (/tx)
- left-indent (/li)
- colors (/colortbl, /red, /blue, /green, /cf)
- font-names (/fonttbl)
- font-size (/fs)
- bold (/b)
- italic (/i)
- text-alignment (/gl, /gc, /gr)
- paper size (/paperw, /paperh)
- margins (/margl, /margr, /margt, /margb)


The program itself consists of two parts:
- A parser (converts RTF into a JSON data-structure)
- A formatter (currently only HTML output is supported)


Both can be easily extended to add new features and handling of additional RTF control codes.


## Command line options

```
Usage: rtfToHtml [options] rtfFile htmlFile

  Options:

    -h, --help                             output usage information
    -V, --version                          output the version number
    -m, --margins [top,right,left,bottom]  Override margins (twips)
    -w, --width [width]                    Override paperwidth (twips)
    -h, --height [height]                  Override paperheight (twips)
    -va, --vertalign [align]               "top", "center", "bottom"
```


## Contribute

If you like this project and want to support it, show some love
and give it a star.


© 2015 Hein Rutjes
