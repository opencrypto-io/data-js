#!/usr/local/bin/node

const path = require('path')
const ocd = require(path.join(__dirname, '..'))

async function cli (argv) {
  const cmd = argv[2] || null
  const args = argv.slice(3)
  // console.log('CMD: %s', cmd)
  // console.log('ARGS: %s', args)

  switch (cmd) {
    case 'get':
    case 'query':
      let res = await ocd[cmd].apply(null, args)
      console.log(JSON.stringify(res, null, 2))
      break

    case null:
      console.error('Please specify command')
      break

    default:
      console.error('Unknown command: %s', cmd)
      break
  }
}

cli(process.argv)
