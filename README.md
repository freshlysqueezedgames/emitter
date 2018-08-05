# Emitter Classes

Really simple base emitter class for creating an application in vanilla JavaScript, along with a singleton for passing event traffic globally between your subclasses.

## Emitter

This simple class allows you to bind and call callbacks based on events that happen in your javascript application, it also provides a means of binding and casting a configuration object
to allow for data-configured instances.

### On

To add an event to an emitter, simply call it's "On" function, specifying the event name and a listener to be called when the 
event is fired.

```javascript
  import Emitter from '@freshlysqueezedgames/emitter'

  const emitter : Emitter = new Emitter
  const payload : Object = {some : 'data'}

  const callback : Function = (payload : Object) => {
    console.log(payload : Object)
    // {some : 'data'}
  }

  emitter.On('test.event', callback)
```

The signature is:

```javascript 
  On (name : string, callback : Function, data? : number | boolean | string) : Emitter
```

The third parameter allows you to define circumstances for the events removal. A number will be a counter which removes the event once it
has been called the same number of times, a boolean of true will remove it after firing once, a string allows an identifier to be used
with the function, so you don't have to hold a reference to the callback to remove it later on.

### Off

To remove a listener, call this function.

```javascript
  emitter.Off('test.event', callback) : Emitter
```

The signature for Off is:

```javascript
   Off (name : string, identifier? : Function | string) : Emitter
```

If you provide no arguments, the emitter will remove ALL its event listeners. Calling just the name will remove all listeners for that event,
using an identifier string or the original callback will remove only that member.

### Emit

Emit is responsible for delivering a payload of data to all listeners for a specific event

```javascript
  emitter.Emit('test.event', {some : 'data'})
```

The above will notify all listeners to 'test.event' that it has happened, and deliver the data.


### Set

Another feature of the Emitter base class is all properties in a given config object will be applied and type-cast to the instance. This can be useful when taking JSON data that might not necessarily
have the right types on the data. If it is parsed XML you are using they will all be strings.

The Set function is seperated for inheritance reasons. In the latest versions of JS super() must be called before referencing the instance properties. Therefore, when you apply default values, Set must be called again to apply the config object correctly. 

Example:

```javascript

   class Test extends Emitter {
     constructor(props? : Object) {
       super(props)

       const t : Test = this

       t.number = 0 // set your default

       t.Set(props) // the configuration value will be applied as a number, regardless of its type.
     }
   }

```

Signature is:

```javascript

   Set (props : Object) : Emitter
```

## Chaining

Note that all the functions for Emitter return the instance, so function calls can be chained.

## Message

This is a global singleton that can be used to register and deregister events in the system. It is an extension of Emitter, with some additional logic to make it the main event passing
singleton for your application. In reality, it is just a global Emitter that exists as a singleton.

```javascript

const message : Message = Message.Instance() // Calling using the Instance method will instantiate an instance if none exists
const emitter : Emitter = new Emitter

message.Watch('test.event', emitter)
message.On('test.event', () => console.log('event was fired via message'))

```

The above may seem simple, but we have a single endpoint that can listen for events, that can be passed back anywhere else in the object heap. So basically on object doesn't have to reference another in order to get events from it.

### Watch

The signature is:

```javascript

Watch (name : string, callback : Function, data? : number | boolean | string)

```

As with Emitter's On method, you can dictate the number of calls or the identifier string as the optional third parameter.