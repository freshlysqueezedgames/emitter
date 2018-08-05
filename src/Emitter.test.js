import Emitter from './Emitter'

describe('#Emitter', () => {
  test('Instantiates with no config parameter required', () => {
    const emitter: Emitter = new Emitter

    expect(emitter).toBeInstanceOf(Emitter)
  })

  test('Should accept a config object with parameters on it', () => {
    const emitter: Emitter = new Emitter({test: 'test'})

    expect(emitter).toHaveProperty('test')
    expect(emitter.test).toEqual('test')
  })

  test('Should not throw is no properties are provided to set', () => {
    const emitter : Emitter = new Emitter({test : 'test'})

    expect(() => {emitter.Set()}).not.toThrowError()
  })

  test('Should cast values based on their original type if defined', () => {
    const emitter: Emitter = new Emitter()

    emitter.a = 0
    emitter.b = true
    emitter.c = 'test'

    emitter.Set({
      a: "1",
      b: 0,
      c: 1,
      d: {
        test: 'test'
      }
    })

    expect(emitter.a).toStrictEqual(1)
    expect(emitter.b).toStrictEqual(false)
    expect(emitter.c).toStrictEqual('1')

    expect(emitter).toHaveProperty('d')
    expect(emitter.d).toEqual({test: 'test'})
  })

  test('Should listen for an event', () => {
    const emitter: Emitter = new Emitter
    const mock: Jest.Mock = jest.fn()

    emitter.On('test.event', mock)
    emitter.Emit('test.event')

    expect(mock).toHaveBeenCalled()
  })

  test('Should remove a listener when the function returns true', () => {
    const emitter: Emitter = new Emitter
    const mock: Jest.Mock = jest.fn()

    mock.mockReturnValueOnce(false)
    mock.mockReturnValueOnce(true)

    emitter.On('test.event', mock)

    emitter.Emit('test.event')
    emitter.Emit('test.event')
    emitter.Emit('test.event')

    expect(mock).toHaveBeenCalledTimes(2) // false will keep the listener, second time it is removed, third it does not exist and is not called
  })

  test('Should forward a payload of data from the emission', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()
    const data : Object = {test : 'test'}

    emitter.On('test.event', mock)
    emitter.Emit('test.event', data)

    expect(mock).toHaveBeenCalledWith(data)
  })

  test('Should throw if an event name is not specified in On', () => {
    const emitter : Emitter = new Emitter

    expect(() => {emitter.On()}).toThrowError()
  })

  test('Should not throw if a callback is not defined, or register the event', () => {
    const emitter : Emitter = new Emitter

    expect(() => {emitter.On('test.event')}).not.toThrowError()
    expect(emitter).not.toHaveProperty('event.test.event')
  })

  test('Should allow for events to be removed by a string identifier', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()

    emitter.On('test.event', mock, 'test')
    emitter.Off('test.event', 'test')

    emitter.Emit('test.event')

    expect(mock).not.toHaveBeenCalled()
  })

  test('Should allow for events of a certain type to be removed', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()

    emitter.On('test.event', mock)
    emitter.On('test.event', mock)

    emitter.Off('test.event')

    emitter.Emit('test.event')

    expect(mock).not.toHaveBeenCalled()
  })

  test('Removes all events if no event name specified', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()

    emitter.On('test.event', mock)
    emitter.On('test.otherevent', mock)

    emitter.Off()

    emitter.Emit('test.event')
    emitter.Emit('test.otherevent')

    expect(mock).not.toHaveBeenCalled()
  })

  test('Removes an event using a reference to the original function', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()

    emitter.On('test.event', mock)

    emitter.Emit('test.event')

    emitter.Off('test.event', mock)

    emitter.Emit('test.event')

    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('Removes an event after being called only once using boolean parameter', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()

    emitter.On('test.event', mock, 1)

    emitter.Emit('test.event')
    emitter.Emit('test.event')

    expect(mock).toHaveBeenCalledTimes(1)    
  })

  test('Removes an event after being called only once using boolean parameter', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()

    emitter.On('test.event', mock, true)

    emitter.Emit('test.event')
    emitter.Emit('test.event')

    expect(mock).toHaveBeenCalledTimes(1)    
  })

  test('Removes an event after being called only once using boolean parameter', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()

    emitter.On('test.event', mock, 3)

    emitter.Emit('test.event')
    emitter.Emit('test.event')
    emitter.Emit('test.event')
    emitter.Emit('test.event') // fourth time should not propogate in listener

    expect(mock).toHaveBeenCalledTimes(3)    
  })

  test('Removes an event after being called only once using boolean parameter', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()

    emitter.On('test.event', mock, 3)

    emitter.Emit('test.event')
    emitter.Emit('test.event')
    emitter.Emit('test.event')
    emitter.Emit('test.event') // fourth time should not propogate in listener

    expect(mock).toHaveBeenCalledTimes(3)    
  })
})