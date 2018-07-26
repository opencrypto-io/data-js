const request = require('axios')
const jmespath = require('jmespath')

class OpencryptoDataClient {
  constructor (options = {}) {
    this.defaults = {
      dataUrl: 'https://opencrypto-io.github.io/data/dist/data.json',
      handlers: {
        loaded () {
          return this.data
        }
      },
      preload: false
    }
    this.collections = {
      project: { col: 'projects' },
      asset: { col: 'assets', path: [ 'project' ] },
      network: { col: 'networks', path: [ 'project', 'asset' ] },
      exchange: { col: 'exchanges', path: [ 'project' ] },
      market: { col: 'markets', path: [ 'project', 'exchange' ] }
    }
    this.config = Object.assign(this.defaults, options)
    this.data = null
    this.loading = false
    if (this.config.preload && this.loading === false) {
      this.load()
    }
    this.initialized = true
  }
  async load () {
    if (!this.isLoaded()) {
      let res
      this.loading = true
      try {
        res = await request.get(this.config.dataUrl)
      } catch (e) {
        this.loading = false
        throw new Error('HTTP Request Error: ' + e)
      }
      this.loading = false
      this.data = res.data
      if (this.config.handlers.loaded) {
        this.config.handlers.loaded()
      }
    }
    return this.data
  }
  async reload () {
    this.data = null
    return this.load()
  }
  async raw () {
    return this.load()
  }
  async query (q) {
    return jmespath.search(await this.load(), q)
  }
  async get (model, id, query = '@') {
    let cc = this.collections[model]
    if (!cc) {
      throw new Error('Collection model not exists: ' + model)
    }
    let key = ''
    let ids = id.split(':')
    if (cc.path) {
      for (let i = 0; i <= cc.path.length; i++) {
        let rk = this.collections[cc.path[i]]
        if (!rk) { rk = { col: cc.col } }
        key += `${rk.col}[?id=='${ids[i]}'] | [0] | `
      }
    } else {
      key = `${cc.col}[?id=='${id}'] | [0] | `
    }
    return this.query(`${key} ${query}`)
  }
  isLoaded () {
    return this.data !== null
  }
  isInitialized () {
    return this.initialized
  }
  on (event, handler) {
    this.config.handlers[event] = handler
    return true
  }
}

var globalClient = null

function glob (fn, args) {
  if (globalClient === null) {
    globalClient = new OpencryptoDataClient()
  }
  return globalClient[fn].apply(globalClient, Array.from(args))
}

const ocd = {
  Client: OpencryptoDataClient,
  raw: function () { return glob('raw', arguments) },
  query: function () { return glob('query', arguments) },
  get: function () { return glob('get', arguments) }
}

module.exports = ocd
