module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "rules": {
      "arrow-parens": [ "error", "always" ],
      "comma-dangle": [
        "error",
        {
          "arrays": "never",
          "objects": "always-multiline",
          "imports": "always-multiline",
          "exports": "always-multiline",
          "functions": "ignore"
        }
      ],
      "indent": [ "error", 2 ],
      "linebreak-style": [ "error", "unix" ],
      "no-await-in-loop": [ "error" ],
      "no-console": [
        "error",
        {
          "allow": [ "error", "log", "warn" ]
        }
      ],
      "no-unused-vars": [
        "error",
        {
          "vars": "all",
          "args": "all"
        }
      ],
      "prefer-const": [ "error" ],
      "quotes": [ "error", "double" ],
      "semi": [ "error", "never" ]
    }
};
