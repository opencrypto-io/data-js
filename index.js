const request = require('axios')
const jmespath = require('jmespath')
const pkg = require('./package.json')

class OpencryptoDataClient {
  constructor (options = {}) {
    this.defaults = {
      dataUrl: 'https://data.opencrypto.io/data.json',
      handlers: {
        loaded: []
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
    if (this.config.preload && !this.isLoaded() && this.loading === false) {
      this.load()
    }
    this.initialized = true
  }
  async load () {
    if (!this.isLoaded() && this.loading) {
      return this.on('loaded')
    }
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
      this.emit('loaded', this.data)
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
  async on (eventName, handler = (d) => d) {
    return new Promise((resolve, reject) => {
      this.config.handlers[eventName].push((data) => {
        resolve(handler(data))
      })
    })
  }
  emit (eventName, data) {
    if (this.config.handlers[eventName].length > 0) {
      this.config.handlers[eventName].forEach(em => {
        em(data)
      })
    }
  }
  version () {
    return pkg.version
  }
}

const ocd = {
  Client: OpencryptoDataClient,
  globalClient: new OpencryptoDataClient()
}

const props = Object.getOwnPropertyNames(Object.getPrototypeOf(ocd.globalClient))
props.forEach(m => {
  ocd[m] = function () {
    return ocd.globalClient[m].apply(ocd.globalClient, Array.from(arguments))
  }
})

module.exports = ocd
