function getInheritedStateValue(inheritedStates, key) {
    for (var i = 0; i < inheritedStates.length; i++) {
        if (inheritedStates[i][key]) {
            return inheritedStates[i][key];
        }
    }
}

/*
function updateStyle(currentStyle, styles, inheritedStyles) {
    let style = '';
    for (var key in styles) {
        const value = (styles[key] && (styles[key] !== getInheritedStateValue(inheritedStyles, key))) ? styles[key] : undefined;
        if (value) {
            style += key + ': ' + value + ';'
        }
    }
    if (style !== currentStyle) {
        if (currentStyle) {
            res += '</span>';
        }
        currentStyle = style;
        if (currentStyle) {
            res += '<span style="' + currentStyle + '">';
        }
    }
}*/

function format(data, inheritedStyles, context) {
    const styles = {};
    let currentStyle;
    let ignoreAll;
    let ignoreNextText;
    for (var i = 0; i < data.length; i++) {
        const item = data[i];
        if (Array.isArray(item)) {
            for (var j = 0; j < item.length; j++) {
                const code = item[j];
                switch (code) {
                    case 'par':
                        //context.res.push('</div>\n');
                        //context.divIndex = -1;
                        context.res.push('<br>');
                        break;
                    case 'tab':
                        //res += '<span style="position: absolute; ">'
                        /*if (!table) {
                            table = true;
                            inheritedStyles = [styles].concat(inheritedStyles);
                            styles = {};
                            insideTableRow = true;
                            res += '<table><tr width: 100px;><td>';
                        }
                        res += '</td><td>';*/
                        break;
                    case 'colortbl':
                    case 'fonttbl':
                    case 'stylesheet':
                        ignoreAll = true;
                        break;
                    case 'expndtw':
                        ignoreNextText = true;
                        break;
                    case 'i': styles['font-style'] = 'italic'; break;
                    case 'i0': styles['font-style'] = 'normal'; break;
                    case 'b': styles['font-weight'] = 'bold'; break;
                    case 'b0': styles['font-weight'] = 'normal'; break;
                    case 'ql':
                    case 'qc':
                    case 'qr':
                        styles['text-align'] = (code === 'qc') ? 'center' : (code === 'qr') ? 'right' : 'left';
                        styles['display'] = 'block';
                        break;
                }
                let fontSize = code.match(/fs(\d+)/);
                if (fontSize) {
                    styles['font-size'] = fontSize[0].substring(2) + 'px';
                }
            }
        }
        else {
            let style = '';
            for (var key in styles) {
                const value = (styles[key] && (styles[key] !== getInheritedStateValue(inheritedStyles, key))) ? styles[key] : undefined;
                if (value) {
                    style += key + ': ' + value + ';'
                }
            }
            if (style !== currentStyle) {
                if (currentStyle) {
                    context.res.push('</span>');
                }
                currentStyle = style;
                if (currentStyle && !ignoreAll) {
                    context.res.push('<span style="' + currentStyle + '">');
                }
            }
            /*if (context.divIndex === -1) {
                context.divIndex = context.res.length;
                context.res.push('<div>&nbsp;');
            }*/
            if (!ignoreAll) {
                if (typeof item === 'string') {
                    if (!ignoreNextText) {
                        context.res.push(item);
                    }
                    else {
                        ignoreNextText = false;
                    }
                }
                else {
                    format(item.group, [styles].concat(inheritedStyles), context);
                }
            }
        }
    }
    if (currentStyle) {
        context.res.push('</span>\n');
    }
    return context.res;
}

export default function(parsedRtf) {
    return '<div>' + format(parsedRtf.group, [], {
        res: [],
        divIndex: -1
    }).join('') + '</div>';
};
