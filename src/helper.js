/**
 * @private
 * @desc
 * Prefills the selected props with the values stored in current memory state
 */
const select = function(props) {
    return memory => {
        const selected = {};
        for (let i = 0; i < props.length; i++) {
            selected[props[i]] = memory[props[i]];
        }
        return selected;
    };
};

/**
 * @private
 * @desc
 * Binds the factory of actions to the memory and wrap them.
 */
const mapActions = function(actions, memory) {
    let mapped = {};
    if (typeof actions === 'function') {
        actions = actions(memory);
    }
    for (let i in actions) {
        mapped[i] = memory.action(actions[i]);
    }
    return mapped;
};

export { select, mapActions };
