import Memory from './memory';
import Provider from './provider';
import connect from './connect';

/**
 * @public
 * @desc Creates a new memory with default initialized values for each memory category.
 * @name createMemory
 * @param {Object} [state={sensory: {}, short: {}, long: {}}]		Mandatory initial state
 * @returns {memory}
 * @example
 *   let memory = createMemory({
 *      sensory: { _count: 0 },
 *      short: { count: 0 },
 *      long: { $count: 0 }
 *   });
 *   memory.subscribe( state => console.log(state) );
 *   memory.setState({ _count: 5, $count: 6 });
 *   memory.getState(); Proxy Lookup Object { _count: 5, count: 0, $count: 6}
 *   memory.snapshot('sensory'); { _count: 5 }
 *   memory.resetSensory();
 *   memory.snapshot('sensory'); { _count: 0 }
 *   memory.resetLong();
 *   memory.snapshot('long'); { $count: 0 }
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
