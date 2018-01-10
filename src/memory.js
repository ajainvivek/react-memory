const __long__ = '__memory__';
const storage = ['sensory', 'short', 'long'];

class Memory {
    constructor(memory) {
        const handler = this.handler();
        this.listeners = [];
        this.defaultLong = Object.assign({}, memory.long || {});
        this.defaultSensory = Object.assign({}, memory.sensory || {});
        memory.long = this.snapshot('long') || memory.long;
        this.state = new Proxy(memory, handler);
    }

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

    subscribe(listener) {
        let listeners = this.listeners;
        listeners.push(listener);
        return () => {
            this.unsubscribe(listener);
        };
    }

    resetSensory() {
        this.setState(this.defaultSensory);
    }

    resetLong() {
        this.setState(this.defaultLong);
    }

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

    setState(update) {
        let state = this.state;
        let currentListeners = this.listeners;
        const keys = Object.keys(update);
        for (let i = 0; i < keys.length; i++) {
            this.state[keys[i]] = update[keys[i]];
        }
        for (let i = 0; i < currentListeners.length; i++) {
            currentListeners[i]();
        }
    }

    getState() {
        return this.state;
    }

    snapshot(type) {
        let state = this.state || {};

        switch (type) {
            case 'sensory':
                state = state.__sensory || {};
                break;
            case 'short':
                state = state.__short || {};
                break;
            case 'long':
                const local = localStorage.getItem(__long__);
                const long = local ? JSON.parse(local) : undefined;
                state = state.__long || long;
                break;
            default:
                break;
        }

        return state;
    }

    handler() {
        return {
            set(target, key, value, receivers) {
                for (let i = 0; i < storage.length; i++) {
                    if (target[storage[i]].hasOwnProperty(key)) {
                        target[storage[i]][key] = value;

                        // if store is long storage then store in localStorage
                        if (storage[i] === 'long') {
                            localStorage.setItem(__long__, JSON.stringify(target.long));
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
