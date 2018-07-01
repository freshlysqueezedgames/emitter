'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @class Emitter
 * @description Base Class for setting up event traffic and binding custom properties to the 
 * instance
 */

var Emitter = function () {
  function Emitter(props) {
    _classCallCheck(this, Emitter);

    this.Set(props);
  }

  /**
   * @name Set
   * @description Applies the object properties to the instance, will parse the type
   * to make sure the object value is correctly cast to the target value
   * @param {Object} props:                    The properties to apply to the instance
   * @return {Emitter} The instance for chaining
   * @public
   */


  _createClass(Emitter, [{
    key: 'Set',
    value: function Set() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var t = this;

      if (!props) {
        return t;
      }

      for (var key in props) {
        if (hasOwnProperty.call(props, key) && props[key] !== undefined) {
          switch (_typeof(t[key])) {
            case 'number':
              {
                t[key] = isNaN(+param) ? 0 : +param;
                break;
              }
            case 'boolean':
              {
                t[key] = !!(props[key] === 'true' || props[key] === '1');
                break;
              }
            default:
              {
                t[key] = props[key];
                break;
              }
          }
        }
      }

      return t;
    }

    /**
     * @name Emit
     * @description Dispatches a payload of data to all the callbacks registered to an event
     * @param {string} name:                 The name of the event
     * @param {Object} payload:              The data to pass to all callbacks
     * @return {Emitter} the instance
     * @public
     */

  }, {
    key: 'Emit',
    value: function Emit(name, payload) {
      var t = this;
      var callbacks = t[Emitter.eventPrefix + name];

      if (!callbacks || !callbacks.length) {
        return t;
      }

      var i = -1;
      var l = callbacks.length;

      console.log('callbacks!', callbacks);

      while (++i < l) {
        var callback = callbacks[i];

        if (callback(payload) === true) {
          // When true is returned (and only true), we remove the event listener 
          callbacks.splice(i--, 1);
          l--;
          continue;
        }

        switch (_typeof(callback.data)) {
          case 'number':
            {
              if (--callback.data < 1) {
                callbacks.splice(i--, 1);
                l--;
              }

              break;
            }

          case 'boolean':
            {
              if (callback.data) {
                callbacks.splice(i--, 1);
                l--;
              }

              break;
            }
        }
      }

      return t;
    }

    /**
     * @name On
     * @description Binds a callback to the instance if the event exists
     * @param {string} name:                The name of event that you want to listen to
     * @param {Function} callback:        The callback to trigger when the event happens
     * @param {string | number | boolean} data:           A boolean of true means one trigger only. A number dictates ythe
     * number of triggers. string attaches an identifier with which to remove the function later. 
     * @return {Emitter} the instance to chain calls
     * @public
     */

  }, {
    key: 'On',
    value: function On(name, callback, data) {
      var t = this;

      if (!callback) {
        return t;
      }

      name = Emitter.eventPrefix + name;

      if (!t[name]) {
        t[name] = [];
      }

      callback.data = data;

      t[name].push(callback);

      return t;
    }

    /**
     * @name Off
     * @description Will remove specified event listeners
     * @param {string} name:                        The name of the event to turn off
     * @param {Function | string} listener:         The listener to remove itself or the string identifier
     * @return {Emitter} the instance for chaining calls
     * @public
     */

  }, {
    key: 'Off',
    value: function Off(name, listener) {
      var t = this;

      name = Emitter.eventPrefix + name;

      if (!t[name]) {
        return t;
      }

      if (!listener) {
        delete t[name];
        return t;
      }

      var callbacks = t[name];
      var i = callbacks.length;

      while (i--) {
        var callback = callbacks[i];

        switch (typeof identifer === 'undefined' ? 'undefined' : _typeof(identifer)) {
          case 'string':
            {
              if (callback.data === identifier) {
                callbacks.splice(i, 1);
              }

              break;
            }

          default:
            {
              if (callback === identifier) {
                callbacks.splice(i, 1);
              }

              break;
            }
        }
      }

      return t;
    }
  }]);

  return Emitter;
}();

Emitter.eventPrefix = 'event.';
exports.default = Emitter;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Emitter2 = require('./Emitter');

var _Emitter3 = _interopRequireDefault(_Emitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hasOwnProperty = Object.prototype.hasOwnProperty;


var instance = null;

/**
 * @class Message
 * @description Controls communication between all controller classes and is a central focus point
 * for any event trafficing in the application.
 */

var Message = function (_Emitter) {
  _inherits(Message, _Emitter);

  /**
   * @description Sets the property for the instance. This global static object is mainly responsible for 
   * managing communications between objects in the means of events. It does not handle STATE management (Actions)
   * please use Redux for this
   * @param  {Object} props :                             instance properties that can be bound before runtime
   * @constructor
   */
  function Message(props) {
    _classCallCheck(this, Message);

    var _this = _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this, props));

    var t = _this;

    if (instance) {
      console.error('Only one message instance can be used at any one time');
      return _possibleConstructorReturn(_this);
    }

    t.listeners = {};

    t.On(Message.EVENTS.GARBAGE_COLLECT, function (event) {
      t.Remove(event);
    });

    instance = t;
    return _this;
  }

  /**
   * @name Instance
   * @description Returns the instance of the object or a new one if one doesn't exist. Should always be instantiated like this 
   * if possible to avoid duplication errors
   * @param {Object} props:                          The instance properties, if an instance exists will not be used
   * @return {Message} The single instance
   * @static
   */


  _createClass(Message, [{
    key: 'Watch',


    /**
     * @name Watch
     * @description Listens for events on the target object given.
     * @param {string} name:                           The name of the event to listen for globally
     * @param {Emitter} target:                        The target object to watch for events from
     * @return {Message} itself for chaining
     * @public
     */
    value: function Watch(name, target) {
      var t = this;

      target.On(name, function (event) {
        t.Emit(name, event);
      });

      return t;
    }

    /**
     * @name Remove
     * @description Removes all listeners, or that given by the type
     * @param {string} name:                 The name of the event to remove. (evaluates to t.Off(name))
     * @return {Message} itself for chaining
     * @public
     */

  }, {
    key: 'Remove',
    value: function Remove(name) {
      var t = this;

      if (name) {
        return t.Off(name);
      }

      for (var key in t) {
        if (hasOwnProperty.call(t, key) && key.match(/^event\./)) {
          t.Off(key);
        }
      }

      return t;
    }
  }], [{
    key: 'Instance',
    value: function Instance(props) {
      return instance || new Message(props);
    }
  }]);

  return Message;
}(_Emitter3.default);

Message.EVENTS = {
  GARBAGE_COLLECT: 'message.garbagecollect' };
exports.default = Message;
