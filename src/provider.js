import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

class Provider extends Component {
    getChildContext() {
        return {
            memory: this.props.memory,
        };
    }
    render() {
        return Children.only(this.props.children);
    }
}

Provider.childContextTypes = {
    memory: PropTypes.object.isRequired
};

Provider.propTypes = {
    memory: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
};

export default Provider;