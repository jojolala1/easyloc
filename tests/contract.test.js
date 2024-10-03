const {somme, soustraction} = require('../src/sql/contract/contract')

describe('tests pour la fonction somme', function(){
    test('demo somme', function(){
        a = somme(2,2)
        expect(a).toBe(4)
    })

    test('demo somme 2', function(){
        a = somme(25,2)
        expect(a).toBe(27)
    })
})

test('demo soustraction', function(){
    a = soustraction(4,2)
    expect(a).toBe(2)
})