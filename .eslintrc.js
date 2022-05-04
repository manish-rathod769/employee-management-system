module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jquery": true,
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        // 'no-console': 0,
        // 'allowForLoopAfterthoughts': true,
        // 'linebreak-style':0,
        // 'no-useless-escape':true,
        // 'no-unused-vars' : ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": false }],
        // 'max-len': 200,
    }
};