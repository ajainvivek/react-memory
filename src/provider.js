import React, { Component, PropTypes, Children } from 'react';

class Provider extends Component {
    getChildContext() {
        return Object.assign(
            {
                memory: this.props.memory,
            },
            this.props
        );
    }
    render() {
        return Children.only(this.props.children);
    }
}

Provider.propTypes = {
    memory: PropTypes.object.isRequired,
};

Provider.childContextTypes = {
    memory: PropTypes.object.isRequired,
};

export default Provider;
