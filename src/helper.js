const select = function(props) {
    return memory => {
        const selected = {};
        for (let i = 0; i < props.length; i++) {
            selected[props[i]] = memory[props[i]];
        }
        return select;
    };
};

const mapActions = function(actions, memory) {
    if (typeof actions === 'function') actions = actions(memory);
    let mapped = {};
    for (let i in actions) {
        mapped[i] = store.action(actions[i]);
    }
    return mapped;
};

export { select, mapActions };
