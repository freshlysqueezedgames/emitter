import Emitter from '@/core/Emitter'

const {hasOwnProperty} = Object.prototype

let instance : Emitter = null

/**
 * @class Message
 * @description Controls communication between all controller classes and is a central focus point
 * for any event trafficing in the application.
 */
class Message extends Emitter {
  static EVENTS : Object = {
    GARBAGE_COLLECT: 'message.garbagecollect'
  }

  /**
   * @description Sets the property for the instance. This global static object is mainly responsible for 
   * managing communications between objects in the means of events. It does not handle STATE management (Actions)
   * please use Redux for this
   * @param  {Object} props :                             instance properties that can be bound before runtime
   * @constructor
   */
  constructor (props : Object) {
    super(props)

    const t : Message = this

    if (instance) {
      console.error('Only one message instance can be used at any one time')
      return
    }

    t.listeners = {}

    t.On(Message.EVENTS.GARBAGE_COLLECT, (event : Event) => {
      t.Remove(event)
    })

    instance = t
  }

  /**
   * @name Instance
   * @description Returns the instance of the object or a new one if one doesn't exist. Should always be instantiated like this 
   * if possible to avoid duplication errors
   * @param {Object} props:                          The instance properties, if an instance exists will not be used
   * @return {Message} The single instance
   * @static
   */
  static Instance (props : Object) : Message {
    return instance || new Message(props)
  }

  /**
   * @name Watch
   * @description Listens for events on the target object given.
   * @param {string} name:                           The name of the event to listen for globally
   * @param {Emitter} target:                        The target object to watch for events from
   * @return {Message} itself for chaining
   * @public
   */
  Watch (name : string, target : Emitter) : Message {
    const t : Message = this

    target.On(name, (event : Event) => {
      t.Emit(name, event)
    })

    return t
  }

  /**
   * @name Remove
   * @description Removes all listeners, or that given by the type
   * @param {string} name:                 The name of the event to remove. (evaluates to t.Off(name))
   * @return {Message} itself for chaining
   * @public
   */
  Remove (name : string) : Message {
    const t : Message = this

    if (name) {
      return t.Off(name)
    }

    for (let key : string in t) {
      if (hasOwnProperty.call(t, key) && key.match(/^event\./)) {
        t.Off(key)
      }
    }

    return t
  }
}

export default Message
