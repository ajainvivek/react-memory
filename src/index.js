class Memory {
    constructor(memory) {
        const handler = this.handler();
        this.keys = {
            sensory: Object.keys(memory.sensory),
            cache: Object.keys(memory.cache),
            browser: Object.keys(memory.browser)
        };
        this.proxy = new Proxy(memory, handler);
    }

    action() {

    }

    setState() {

    }

    getState() {

    }

    observe() {

    }

    handler() {
        return {
            set(target, key, value) {
                return true;
            },
            get(target, key) {
                // first get sensory -> cache -> browser -> null
                return target[key];
            }
        };
    }
};

export default function createMemory({
    sensory,
    cache,
    browser
}) {
    sensory = sensory || {};
    cache = cache || {};
    browser = browser || {};

    const memory = new Memory({
        sensory,
        cache,
        browser
    });

    return {
        ...memory
    };
};

// Example
createMemory({
    sensory: {
        _a: 'hello'
    },
    cache: {
        b: 'world'
    },
    browser: {
        $c: '!'
    }
});