import crypt from './crypto';

const __long__ = '__memory__';
const storage = ['sensory', 'short', 'long'];

class Memory {
    constructor(memory, options = {}) {
        const handler = this.handler();

        this.listeners = [];
        this.defaultLong = Object.assign({}, memory.long || {});
        this.defaultSensory = Object.assign({}, memory.sensory || {});
        this.options = options;

        // retrieve the memory from localStorage
        memory.long = this.snapshot('long') || memory.long;
        this.state = new Proxy(memory, handler);
    }

    /**
     * @public
     * @desc Remove the subscribed listener function
     *
     * @param  {Function} listener function to be detached from subscribed listeners
     */
    unsubscribe(listener) {
        let out = [];
        let listeners = this.listeners;
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i] === listener) {
                listener = null;
            } else {
                out.push(listeners[i]);
            }
        }
        listeners = out;
    }

    /**
     * @public
     * @desc Register a listener function so it can be called when state is changed
     *
     * @param  {Function} listener function to be attached to list of subscribed listeners
     */
    subscribe(listener) {
        let listeners = this.listeners;
        listeners.push(listener);
        return () => {
            this.unsubscribe(listener);
        };
    }

    /**
     * @public
     * @desc Reset the sensory memory
     */
    resetSensory() {
        this.setState(this.defaultSensory);
    }

    /**
     * @public
     * @desc Reset the long term memory
     */
    resetLong() {
        this.setState(this.defaultLong);
    }

    /**
     *  @private
     *  @desc Create a bound copy of the given action function.
     *  The bound returned function invokes action() and persists the result back to the memory.
     *  If the return value of `action` is a Promise, the resolved value will be used as state.
     *
     *  @param {Function} action	An action of the form `action(state, ...args) -> stateUpdate`
     *  @returns {Function} boundAction()
     */
    action(action) {
        let setState = this.setState.bind(this);
        let values = this.state;
        return function() {
            args = [values];
            for (let i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            let state = action.apply(this, args);
            if (state !== null) {
                if (state.then) {
                    state.then(setState);
                } else {
                    setState(state);
                }
            }
        };
    }

    /**
     *  @public
     *  @desc Update the partial state from the current proxy/state, and call the registered listeners
     *
     *  @param {Object} update	Partial values to be updated to the memory
     */
    setState(update) {
        let state = this.state;
        let currentListeners = this.listeners;
        const keys = Object.keys(update);
        for (let i = 0; i < keys.length; i++) {
            this.state[keys[i]] = update[keys[i]];
        }
        for (let i = 0; i < currentListeners.length; i++) {
            currentListeners[i](this.state);
        }
    }

    /**
     * @public
     * @desc Get the current state of the memory
     *
     * @returns {Object} state - current state of the memory
     */
    getState() {
        return this.state;
    }

    /**
     * @public
     * @desc To retrieve specific type from the memory
     *
     * @param {String} type	memory type i.e sensory, short, long
     */
    snapshot(type) {
        let state = this.state || {};
        let secret = this.options.secret;

        switch (type) {
            case 'sensory':
                state = state.__sensory || {};
                break;
            case 'short':
                state = state.__short || {};
                break;
            case 'long':
                const local = localStorage.getItem(__long__);
                const long = local ? crypt.decode(local, secret) : undefined;
                state = state.__long || long;
                break;
            default:
                break;
        }

        return state;
    }

    /**
     * @private
     * @desc Proxy getter/setter handlers
     *
     * @returns {Object} proxy handlers
     */
    handler() {
        let self = this;

        return {
            set(target, key, value, receivers) {
                for (let i = 0; i < storage.length; i++) {
                    if (target[storage[i]].hasOwnProperty(key)) {
                        target[storage[i]][key] = value;

                        // if store is long storage then store in localStorage
                        if (storage[i] === 'long') {
                            let secret = self.options.secret;
                            localStorage.setItem(__long__, crypt.encode(target.long, secret));
                        }
                    }
                }
                return true;
            },
            get(target, key) {
                // first get sensory -> short -> long -> null
                let value;
                for (let i = 0; i < storage.length; i++) {
                    if (typeof value === 'undefined') {
                        value = target[storage[i]][key];
                    }
                }

                // this only to retrieve specific snapshot i.e sensory, short, long
                if (typeof value === 'undefined') {
                    if (key.substr(0, 2) === '__') {
                        const type = key.substr(2);
                        value = target[type];
                    }
                }

                return value;
            },
        };
    }
}

export default Memory;
