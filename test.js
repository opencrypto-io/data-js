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

  it('version()', async () => {
    let pattern = /^\d+\.\d+\.\d+$/
    let version = await data.version()
    assert.ok(version.match(pattern), 'version [' + version + '] not match pattern: ' + pattern)
  })

  it('query(q)', async () => {
    let res = await data.query("projects[?id=='bitcoin'] | @[0] | assets[?symbol=='BTC'].images.logo_square.type")
    assert.equal(res, 'svg')
  })

  it('get(model, id)', async () => {
    let res = await data.get('project', 'ethereum')
    assert.equal(res.webids.twitter, 'ethereum')
  })

  it('get(model, id, q)', async () => {
    let res = await data.get('project', 'ethereum', 'webids.twitter')
    assert.equal(res, 'ethereum')
  })

  it('get(submodel, id)', async () => {
    let res = await data.get('asset', 'ethereum:eth')
    assert.equal(res.symbol, 'ETH')
  })

  it('get(submodel, id, q)', async () => {
    let res = await data.get('asset', 'ethereum:eth', 'symbol')
    assert.equal(res, 'ETH')
  })

  it('raw()', async () => {
    let res = await data.raw()
    assert.equal(res.projects[0].assets[0].symbol, 'BTC')
  })

  it('get() item not found', async () => {
    await data.get('nonexistent', 'litecoin').catch((e) => { })
  })
})

describe('OpencryptoData.get(col, id, q) (static)', () => {
  it('get(col, id q)', async () => {
    assert.equal(await ocd.get('project', 'ethereum', 'webids.twitter'), 'ethereum')
  })
})
