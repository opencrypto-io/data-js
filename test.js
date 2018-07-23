/* global describe, it, before */
const assert = require('assert')

const ocd = require('.')

describe('Loading', () => {
  it('new client()', async () => {
    const data = await new ocd.Client()
    assert.equal(data.isInitialized(), true, 'isInitialized')
  })

  it('new client({ preload: true })', (done) => {
    const data = new ocd.Client({ preload: true })
    assert.equal(data.isInitialized(), true, 'isInitialized')
    data.on('loaded', () => {
      assert.equal(data.isLoaded(), true, 'isLoaded')
      done()
    })
  })
})

describe('Using (client)', () => {
  var data = null
  before(async () => {
    data = await new ocd.Client()
  })

  it('query(q)', async () => {
    let res = await data.query("assets[?symbol=='BTC'].images.logo_square.type")
    assert.equal(res, 'svg')
  })

  it('get(col, id)', async () => {
    let res = await data.get('assets', 'litecoin')
    assert.equal(res.webids.twitter, 'litecoin')
  })

  it('get(col, id, q)', async () => {
    let res = await data.get('assets', 'litecoin', 'webids.twitter')
    assert.equal(res, 'litecoin')
  })

  it('raw()', async () => {
    let res = await data.raw()
    assert.equal(res.assets[0].symbol, 'ZRX')
  })

  it('data.get() not found', async () => {
    let res = await data.get('nonexistent', 'litecoin')
    assert.equal(res, null)
  })
})

describe('OpencryptoData.get(col, id, q) (static)', () => {
  it('get(col, id q)', async () => {
    const res = await ocd.get('assets', 'litecoin', 'webids.twitter')
    assert.equal(res, 'litecoin')
  })
})
