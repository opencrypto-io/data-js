#!/usr/local/bin/node

const path = require('path')
const ocd = require(path.join(__dirname, '..'))

function err (m) {
  console.error(m)
  process.exit(1)
}

async function cli (argv) {
  const cmd = argv[2] || null
  const args = argv.slice(3)
  const client = new ocd.Client()

  if (cmd === null) {
    return err('Please specify command')
  }
  if (!client[cmd]) {
    return err('Unknown command: ' + cmd)
  }
  let res = await client[cmd].apply(client, args)
  console.log(JSON.stringify(res, null, 2))
}

cli(process.argv)
