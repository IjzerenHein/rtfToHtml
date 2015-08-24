function getInheritedStateValue(inheritedStates, key) {
    for (var i = 0; i < inheritedStates.length; i++) {
        if (inheritedStates[i][key]) {
            return inheritedStates[i][key];
        }
    }
}

function inchToPx(inch) {
    return Math.floor(inch / 10);
}

function formatStyles(styles, inheritedStyles) {
    let style = '';
    for (var key in styles) {
        const value = (styles[key] && (styles[key] !== getInheritedStateValue(inheritedStyles, key))) ? styles[key] : undefined;
        if (value) {
            style += key + ': ' + value + ';'
        }
    }
    return style;
}

function pushStyles(context) {
    const formattedStyles = formatStyles(context.styles, context.inheritedStyles);
    if (formattedStyles) {
        context.res.push('<span style="' + formattedStyles + '">');
    }
    context.inheritedStyles.unshift(context.styles);
    context.styles = {};
    context.lastFormattedStyles = formattedStyles;
}

function popStyles(context) {
    context.styles = context.inheritedStyles[0];
    context.inheritedStyles = context.inheritedStyles.slice(1);
    const formattedStyles = formatStyles(context.styles, context.inheritedStyles);
    if (formattedStyles) {
        context.res.push('</span>');
    }
}

function applyStyles(context) {
    const formattedStyles = formatStyles(context.styles, context.inheritedStyles);
    if (context.lastFormattedStyles !== formattedStyles) {
        popStyles(context);
        pushStyles(context);
    }
}

function beginRightAlignedTab(context) {
    context.rightAlignedTab = true;
    //pushStyles(context);
    //context.res.push('<span style="float: right;">');
    context.res[context.divIndex] = '<div style="display: inline-block; text-align: right; width: ' + getTabWidth(context) + 'px;">';
}

function endRightAlignedTab(context) {
    if (context.rightAlignedTab) {
        context.rightAlignedTab = false;
        //context.res.push('</span>');
        //popStyles(context);
    }
}

function getTabWidth(context) {
    const begin = (context.tabIndex === 0) ? 0 : context.tabs[context.tabIndex - 1].pos;
    const end = ((context.tabIndex + 1) < context.tabs.length) ? context.tabs[context.tabIndex].pos : getPaperWidth(context);
    return end - begin;
}

function getPaperWidth(context) {
    //const paperWidth = context.paperWidth - (context.marginLeft || 0) - (context.marginRight || 0);
    const paperWidth = context.paperWidth - 3288;
    return inchToPx(paperWidth);
}

function parseIntCode(code, prefix) {
    if (code.substring(0, prefix.length) === prefix) {
        console.log(code);
        return parseInt(code.substring(prefix.length));
    }
}

function format(context, data) {
    let ignoreAll;
    let ignoreNextText;
    for (var i = 0; i < data.length; i++) {
        const item = data[i];
        if (Array.isArray(item)) {
            let resetTabs = true;
            let tabAlign;
            for (var j = 0; j < item.length; j++) {
                const code = item[j];
                switch (code) {
                    case 'par':
                        endRightAlignedTab(context);
                        if (context.divIndex >= 0) {
                            popStyles(context);
                            context.res.push('</div>');
                            context.divIndex = -1;
                        }
                        context.tabIndex = 0;
                        context.res.push('<br>\n');
                        break;
                    case 'tab':
                        if (context.tabIndex < context.tabs.length) {
                            if (context.divIndex < 0) {
                                context.divIndex = context.res.length;
                                context.res.push('<div style="display: inline-block; width: ' + getPaperWidth(context) + 'px;">');
                                pushStyles(context);
                            }
                            if (context.rightAlignedTab) {
                                endRightAlignedTab(context);
                                popStyles(context);
                                context.res.push('</div>');
                                context.divIndex = context.res.length;
                                context.res.push('<div style="display: inline-block;">');
                                pushStyles(context);
                            }
                            const tab = context.tabs[context.tabIndex];
                            context.res[context.divIndex] = '<div style="display: inline-block; width: ' + getTabWidth(context) + 'px;">';
                            if (tab.align === 'right') {
                                beginRightAlignedTab(context);
                                context.tabIndex++;
                            }
                            else {
                                context.tabIndex++;
                                popStyles(context);
                                context.res.push('</div>');
                                context.divIndex = context.res.length;
                                context.res.push('<div style="display: inline-block; width: ' + (getPaperWidth(context) - tab.pos) + 'px;">');
                                pushStyles(context);
                            }
                        }
                        break;
                    case 'colortbl':
                    case 'fonttbl':
                    case 'stylesheet':
                        ignoreAll = true;
                        break;
                    case 'expndtw':
                        ignoreNextText = true;
                        break;
                    case 'tqr':
                        context.tabs = resetTabs ? [] : context.tabs;
                        resetTabs = false;
                        tabAlign = 'right';
                        break;
                    case 'i': context.styles['font-style'] = 'italic'; break;
                    case 'i0': context.styles['font-style'] = 'normal'; break;
                    case 'b': context.styles['font-weight'] = 'bold'; break;
                    case 'b0': context.styles['font-weight'] = 'normal'; break;
                    case 'ql':
                    case 'qc':
                    case 'qr':
                        context.styles['text-align'] = (code === 'qc') ? 'center' : (code === 'qr') ? 'right' : 'left';
                        break;
                }
                let fontSize = code.match(/fs(\d+)/);
                if (fontSize) {
                    context.styles['font-size'] = fontSize[0].substring(2) + 'px';
                }
                context.paperWidth = parseIntCode(code, 'paperw') || context.paperWidth;
                context.marginLeft = parseIntCode(code, 'margl') || context.marginLeft;
                context.marginRight = parseIntCode(code, 'margr') || context.marginRight;
                context.marginRight = parseIntCode(code, 'li') || context.marginRight;

                let tabStop = code.match(/tx(\d+)/);
                if (tabStop) {
                    context.tabs = resetTabs ? [] : context.tabs;
                    resetTabs = false;
                    context.tabs.push({
                        pos: inchToPx(tabStop[0].substring(2)),
                        align: tabAlign || 'left'
                    });
                    tabAlign = undefined;
                }
                let leftIndent = parseIntCode(code, 'li');
                if (leftIndent !== undefined) {
                    context.styles['text-indent'] = leftIndent ? (inchToPx(leftIndent) + 'px') : 0;
                    context.styles['white-space'] = leftIndent ? 'nowrap' : 'normal';
                }
            }
        }
        else {
            if (!ignoreAll) {
                if (typeof item === 'string') {
                    if (!ignoreNextText) {
                        if (context.divIndex < 0) {
                            context.divIndex = context.res.length;
                            context.res.push('<div style="display: inline-block; width: ' + getPaperWidth(context) + 'px;">');
                            pushStyles(context);
                        }
                        applyStyles(context);
                        context.res.push(item);
                    }
                    else {
                        ignoreNextText = false;
                    }
                }
                else {
                    pushStyles(context);
                    format(context, item.group);
                    popStyles(context);
                }
            }
        }
    }
    return context.res;
}

export default function(parsedRtf) {
    const context = {
        res: [],
        divIndex: -1,
        inheritedStyles: [],
        styles: {},
        tabIndex: 0,
        tabs: []
    };
    format(context, parsedRtf.group);
    return '<div style="font-family: \'Times New Roman\';">' + context.res.join('') + '</div>';
};
