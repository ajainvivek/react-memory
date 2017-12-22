import React from 'react';
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
