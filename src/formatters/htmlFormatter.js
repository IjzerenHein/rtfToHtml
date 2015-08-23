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

function format(data, inheritedStyles) {
    const styles = {};
    let table;
    let currentStyle;
    let res = '';
    for (var i = 0; i < data.length; i++) {
        const item = data[i];
        if (Array.isArray(item)) {
            for (var j = 0; j < item.length; j++) {
                const code = item[j];
                switch (code) {
                    case 'par':
                        /*if (table) {
                            table +=
                        }*/
                        res += '<br>';
                        break;
                    case 'tab':
                        //table = table || '<table><tr width: 100px;>';
                        res += '<span style="width: 100px; display: inline-block;">&nbsp</span>';
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
                    res += '</span>';
                }
                currentStyle = style;
                if (currentStyle) {
                    res += '<span style="' + currentStyle + '">';
                }
            }
            if (typeof item === 'string') {
                res += item;
            }
            else {
                res += format(item.group, [styles].concat(inheritedStyles));
            }
        }
    }
    if (currentStyle) {
        res += '</span>\n';
    }
    return res;
}

export default function(parsedRtf) {
    return '<div>' + format(parsedRtf.group, []) + '</div>';
};
