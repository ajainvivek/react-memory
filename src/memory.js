class Memory {
    constructor(memory, propTypes) {
        const handler = this.handler();
        this.keys = {
            sensory: Object.keys(memory.sensory),
            cache: Object.keys(memory.cache),
            browser: Object.keys(memory.browser),
        };
        this.listeners = [];
        this.proxy = new Proxy(memory, handler);
    }

    unsubscribe() {
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

    action(action) {
        let setState = this.setState;
        return function() {
            let args = [state];
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
        state = Object.assign(this.proxy, update);
    }

    getState() {
        return this.proxy;
    }

    handler() {
        return {
            set(target, key, value, receivers) {
                return true;
            },
            get(target, key) {
                // first get sensory -> cache -> browser -> null
                return target[key];
            },
        };
    }
}

export default Memory;
