import Memory from './memory';
import Provider from './provider';
import HOC from './hoc';
import { select } from './helper';

const connect = function(mapStateToProps, actions) {
    mapStateToProps = Array.isArray(mapStateToProps) ? mapStateToProps : [];
    mapStateToProps = select(mapStateToProps);

    return WrappedComponent => {
        return HOC(WrappedComponent, mapStateToProps, actions);
    };
};
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
    cache: {
        b: 'world',
    },
    browser: {
        $c: '!',
    },
});
 */
const createMemory = function({ sensory, cache, browser }, config = {}) {
    sensory = sensory || {};
    cache = cache || {};
    browser = browser || {};

    const memory = new Memory(
        {
            sensory,
            cache,
            browser,
        },
        config.propTypes || {}
    );

    return memory;
};

export { Provider, connect, createMemory };
