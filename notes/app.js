#!/usr/bin/env node

const yargs = require('yargs')

const notes = require('./notes')

const args = {
  title: ['title', { describe: 'Title of note', type: 'string' }],
  body: ['body', { describe: 'Body of note', type: 'string' }],
}

yargs
  .scriptName('notes')
  .command(
    'add <title> <body>',
    'Add new note or append to existing note',
    y => y.positional(...args.title).positional(...args.body),
    main(notes.add)
  )
  .command('list', 'List all notes', {}, main(notes.list))
  .command(
    'read <title>',
    'Read note',
    y => y.positional(...args.title),
    main(notes.read)
  )
  .command(
    'remove <title>',
    'Remove note',
    y => y.positional(...args.title),
    main(notes.remove)
  )
  .demandCommand()
  .parse()

//

function main(fn) {
  return args => {
    try {
      fn(args)
    } catch (err) {
      console.error(err.message)
      process.exit(1)
    }
  }
}
