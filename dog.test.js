const createDog = require('./dog.js')

test('dog create function', () => {
  expect(createDog('spot', 5, '20 lbs')).toEqual({
    name: 'spot',
    age: 5,
    weight: '20 lbs'
  })
});
