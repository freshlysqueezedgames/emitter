import Emitter from './Emitter'
import Message from './Message'

describe('#Message', () => {
  const message : Message = new Message

  test('Should only ever return one instance', () => {
    expect(message).toStrictEqual(Message.Instance())
  })

  test('Should throw if more than one instance created', () => {
    expect(() => new Message).toThrowError()
  })

  test('Should be able to listen for events on an Emitter', () => {
    const emitter : Emitter = new Emitter
    const mock : Jest.Mock = jest.fn()

    message.Watch('test.event', emitter)
    message.On('test.event', mock)

    emitter.Emit('test.event')

    expect(mock).toHaveBeenCalled()
  })
})