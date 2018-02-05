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

/**
 * @private
 * @desc
 * Generate unique id  - RFC4122 version 4 compliant
 */
const generateUniqueId = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * @private
 * @desc
 * Capitalize first letter
 */
function camelizeLetters(string) {
    return string
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        })
        .replace(/\s+/g, '');
}

export { select, mapActions, generateUniqueId, camelizeLetters };
