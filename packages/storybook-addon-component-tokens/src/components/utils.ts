const RE_COLOR = /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$|(rgb|hsl)a?\((\s*-?\d+%?\s*,){2}(\s*-?\d+%?\s*,?\s*\)?)(,\s*(0?\.\d+)?|1)?\)/i;
const RE_VAR = /^(var|calc|\d|\.)/;

const memo: { [name: string]: boolean } = {};

export const isValidColor = (strColor: string) => {
    if(!(strColor in memo)) {
        if(RE_VAR.test(strColor)) {
            memo[strColor] = false;
        } else if(RE_COLOR.test(strColor)) {
            memo[strColor] = true;
        } else {
            const s = new Option().style;
            s.color = strColor;
            memo[strColor] = s.color === strColor.toLowerCase();
        }
    }

    return memo[strColor];
};
