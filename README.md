# Emitter Classes

Really simple base classes for creating and application in pure JavaScript. 

## Emitter

Use this as a base class for your Objects, it takes a config object and will parse it's values into the appropriate types (say for example you wish to instantiate from parsed XML.

## Message

This is a global singleton that can be used to register and deregister events in the system. It is an extension of Emitter, with some additional logic to make it the main communication
point of your application.