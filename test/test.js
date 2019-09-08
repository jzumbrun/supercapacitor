const assert = require('assert'),
    axios = require('axios'),
    util = require('../src/util'),
    SC = require('../supercapacitor')

describe('util library', function() {
    it('`each` should match expected values for object', function() {
        let expected = {thing_one: 'one', thing_two: 'two'}
        let actual = {}

        util.each(expected, (v, i) => {
            actual[i] = v
        })

        assert.deepStrictEqual(expected, actual)
    })
    it('`each` should match expected values for array', function() {
        let expected = ['one', 'two']
        let actual = []

        util.each(expected, (v) => {
            actual.push(v)
        })

        assert.deepStrictEqual(expected, actual)
    })
})

describe('supercapacitor', function() {
    it('should return public objects', function() {
        assert.deepStrictEqual(Object.keys(SC),
            [ 'Component', 'Doh', 'Event', 'Store' ])
    })
})

describe('Store', function() {
    it('should be inheritable', function() {
        class Testing extends SC.Store {
            constructor() {
                super('testing')
            }
        }
        let testing = new Testing()
        assert(testing.getState)
    })
})

describe('axios', function() {
    it('should be a function', function() {
        assert(typeof axios.post == 'function')
    })
})