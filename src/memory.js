const storage = ['sensory', 'cache', 'browser'];

class Memory {
    constructor(memory) {
        const handler = this.handler();
        this.listeners = [];
        this.defaultSensory = Object.assign({}, memory.sensory || {});
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
        const keys = Object.keys(update);
        for (let i = 0; i < keys.length; i++) {
            this.state[keys[i]] = update[keys[i]];
        }
    }

    getState() {
        return this.state;
    }

    handler() {
        return {
            set(target, key, value, receivers) {
                for (let i = 0; i < storage.length; i++) {
                    if (target[storage[i]].hasOwnProperty(key)) {
                        target[storage[i]][key] = value;
                    }
                }
                return true;
            },
            get(target, key) {
                // first get sensory -> cache -> browser -> null
                let value;
                for (let i = 0; i < storage.length; i++) {
                    if (typeof value === 'undefined') {
                        value = target[storage[i]][key];
                    }
                }
                return value;
            },
        };
    }
}

export default Memory;
