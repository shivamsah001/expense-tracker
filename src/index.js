#!/usr/bin/env node

const { Command } = require('commander');
const addCommand = require('./commands/add');
const listCommand = require('./commands/list');
const summaryCommand = require('./commands/summary');

const program = new Command();

program
  .name('expense')
  .description('A simple CLI expense tracker')
  .version('1.0.0');

program.addCommand(addCommand);
program.addCommand(listCommand);
program.addCommand(summaryCommand);

program.parse(process.argv);

// Show help when no command is provided.
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
