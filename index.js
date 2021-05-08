#!/usr/bin/env node

const args = require("args");
const organizeFiles = require("./organize");

args.parse(process.argv);

const dir = args.sub[0];

organizeFiles(dir)
  .then((count) => {
    console.log(`Organized ${count} files`);
  })
  .catch((err) => {
    console.error(err);
  });
