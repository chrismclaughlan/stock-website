
const CONSOLE_RED = '\x1b[31m%s\x1b[0m';
const CONSOLE_YELLOW = '\x1b[33m%s\x1b[0m';
const CONSOLE_GREEN = '\x1b[32m%s\x1b[0m';

const PRINT_DEBUG_SUCCESS = true;
const PRINT_DEBUG_ERRORS_SOFT = true;

const printMessage = (colour, area, type, content, action, query, cols) => {

    console.log(colour, `[${area}] - ${type}${(action !== undefined) ? ` while ${action}` : ''} - ${content}`)

    if (query) {
        console.log(colour, `[${area}] - QUERY: '${query}'`);
    }
    if (cols) {
        console.log(colour, `[${area}] - COLS:  ${JSON.stringify(cols)}`);
    }
}

const validateRequest = (req, properties, res) => {
    let propertyNotDefined = '';
    properties.forEach(property => {
        if (! req[property] || req[property].length === 0) {
            propertyNotDefined = property;
            return false;
        }
    })

    if (propertyNotDefined) {
        res.json({
            success: false,
            msg: `${propertyNotDefined} not defined`,
        }).end()
        return false;
    }

    return true;
}

module.exports = {
    printMessage, validateRequest,

    // Constants
    CONSOLE_RED, CONSOLE_YELLOW, CONSOLE_GREEN,
    PRINT_DEBUG_SUCCESS, PRINT_DEBUG_ERRORS_SOFT,
};
