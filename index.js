const request = require('axios')
const jmespath = require('jmespath')

class OpencryptoData {
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
  async get (collection, id, query = '@') {
    return this.query(`${collection}[?id=='${id}'] | [0] | ${query}`)
  }
  async query (q) {
    return jmespath.search(await this.load(), q)
  }
  async raw () {
    return this.load()
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

exports['OpencryptoData'] = OpencryptoData
module.exports = OpencryptoData
