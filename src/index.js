import Memory from './memory';
import Provider from './provider';
import connect from './connect';
/**
 * 
 * @param {*} param0 
 * @param {*} config 
 * 
 * 
 * 
createMemory({
    sensory: {
        _a: 'hello',
    },
    short: {
        b: 'world',
    },
    long: {
        $c: '!',
    },
});
 */
const createMemory = function({ sensory, short, long }, config = {}) {
    sensory = sensory || {};
    short = short || {};
    long = long || {};

    const memory = new Memory(
        {
            sensory,
            short,
            long,
        },
        config.propTypes || {}
    );

    return memory;
};

export { Provider, connect, createMemory };
