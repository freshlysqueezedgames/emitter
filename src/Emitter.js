const {hasOwnProperty} = Object.prototype

const EVENTS_REGEX : RegExp = /^event\./

/**
 * @class Emitter
 * @description Base Class for setting up event traffic and binding custom properties to the 
 * instance
 */
export default class Emitter {
  static eventPrefix : string = 'event.'

  constructor (props? : Object) {
    this.Set(props)
  }

  /**
   * @name Set
   * @description Applies the object properties to the instance, will parse the type
   * to make sure the object value is correctly cast to the target value
   * @param {Object} props:                    The properties to apply to the instance
   * @return {Emitter} The instance for chaining
   * @public
   */
  Set (props : Object = {}) : Emitter {
    const t : Emitter = this

    if (!props) {
      return t
    }

    for (let key in props) {
      if (hasOwnProperty.call(props, key) && props[key] !== undefined) {
        const value : any = props[key]

        switch (typeof t[key]) {
          case ('number'): {
            t[key] = isNaN(+value) ? 0 : +value
            break
          }
          case ('boolean'): {
            t[key] = !!(value === 'true' || value === '1')
            break
          }
          case ('string') : {
            t[key] = value.toString()
            break;
          }
          default: {
            t[key] = value
            break
          }
        }   
      }
    }

    return t
  }

  /**
   * @name Emit
   * @description Dispatches a payload of data to all the callbacks registered to an event
   * @param {string} name: The name of the event
   * @param {Object} payload: The data to pass to all callbacks
   * @return {Emitter} the instance
   * @public
   */
  Emit (name : string, payload : Object) : Emitter {
    const t : Emitter = this
    const callbacks : Array = t[Emitter.eventPrefix + name]

    if (!callbacks || !callbacks.length) {
      return t
    }

    let i : number = -1
    let l : number = callbacks.length

    while (++i < l) {
      const callback : Function = callbacks[i]

      if (callback(payload) === true) { // When true is returned (and only true), we remove the event listener 
        callbacks.splice(i--, 1)
        l--
        continue
      }

      switch (typeof callback.data) {
        case ('number'): {
          if (--callback.data < 1) {
            callbacks.splice(i--, 1)
            l--
          }

          break
        }

        case ('boolean'): {
          if (callback.data) {
            callbacks.splice(i--, 1)
            l--
          }

          break
        }
      }
    }

    return t
  }

  /**
   * @name On
   * @description Binds a callback to the instance if the event exists
   * @param {string} name: The name of event that you want to listen to
   * @param {Function} callback: The callback to trigger when the event happens, return true from the function to remove from callback list
   * @param {string | number | boolean} data: A boolean of true means one trigger only. A number dictates the
   * number of triggers before removal. string attaches an identifier with which to remove the function later. 
   * @return {Emitter} the instance to chain calls
   * @public
   */
  On (name : string, callback : Fn, data? : string | number | boolean) : Emitter {
    const t : Emitter = this

    if (!name) {
      throw new Error('no event name provided to listen for!')
    }

    if (!callback) {
      return t
    }

    name = Emitter.eventPrefix + name

    if (!t[name]) {
      t[name] = []
    }

    callback.data = data

    t[name].push(callback)

    return t
  }

  /**
   * @name Off
   * @description Will remove specified event listeners
   * @param {string} name:  The name of the event to turn off
   * @param {Function | string} listener: The listener to remove itself or the string identifier
   * @return {Emitter} the instance for chaining calls
   * @public
   */
  Off (name : string, listener : Function | string) : Emitter {
    const t : Emitter = this
    
    name = Emitter.eventPrefix + name

    if (!t[name]) {
      for (let key in t) {
        if(hasOwnProperty.call(t, key) && key.match(EVENTS_REGEX)) {
          delete t[key]
        }
      }

      return t
    }

    if (!listener) {
      delete t[name]
      return t
    }

    const callbacks = t[name]
    let i : number = callbacks.length

    while (i--) {
      const callback : Function = callbacks[i]

      switch (typeof listener) {
        case ('string'): {
          if (callback.data === listener) {
            callbacks.splice(i, 1)
          }

          break
        }
        default: {
          if (callback === listener) {
            callbacks.splice(i, 1)
          }

          break
        }
      }
    }

    return t
  }
}
