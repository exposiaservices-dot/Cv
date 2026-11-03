# Vendored reveal.js-plugins

`reveal.js-plugins/` contains the published npm package `reveal.js-plugins@4.6.0` by Asvin Goel and contributors, MIT licensed; see its `LICENSE`. Source: https://github.com/rajgoel/reveal.js-plugins . The npm tarball integrity is `sha512-3x7iE7zK7vtiswykcxwJL5VX4IKkk/rFc3bDjgO13ACFjPuC3MzYtI8ARchXPwkrWR7qckNwFJ0JNPf5jhnpzA==` (SHA-1 `6db53ff425e93cb9dc5f00b9ffbe368afe4de293`).

All published plugin files and notices are retained unmodified. The sole change is deleting `dependencies: { "npm": "^6.13.4" }` from the vendored `package.json`: the package has no scripts or JavaScript imports using npm, and shipping an npm CLI with browser plugin files pulled in a large vulnerable dependency tree. The existing template uses its own adaptations of the chalkboard etc. rather than importing these plugins at runtime. This is a maintained local package variant, not an upstream release; if updating it, check the new upstream package and apply/review this change again, retain notices, compare files, and run the full tests. Do not treat removal of the unused CLI as a guarantee about plugin security.

The local manifest `vendor/reveal.js-plugins-integrity.json` records SHA-256 for each vendored file; `npm run check:vendor` checks it, including the edited package manifest. It is a regression check, not an independent signature.
