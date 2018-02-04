import React, { Component, createElement } from 'react';
import { mapActions } from './helper';
import PropTypes from 'prop-types';

const HOC = (WrappedComponent, mapStateToProps, actions) => {
    class WrapperComponent extends Component {
        constructor(props, context) {
            super(props);
            this.memory = context.memory;
            this.state = mapStateToProps(this.memory ? this.memory.getState() : {});
            this.actions = actions ? mapActions(actions, this.memory) : this.memory;
        }
        /**
         * @private
         * @desc Compares the current component state with memory's current state,
         *  if the values arent equal then force updates the child components props with the modified state
         */
        update() {
            let mapped = mapStateToProps(this.memory ? this.memory.getState() : {});

            for (let i in mapped) {
                if (mapped[i] !== this.state[i]) {
                    this.setState(mapped);
                }
            }

            for (let i in this.state) {
                if (mapped[i] !== this.state[i]) {
                    this.setState(mapped);
                }
            }
        }
        componentDidMount() {
            const component = `_${WrappedComponent.name.toLowerCase()}`;
            this.memory.resetSensory(component); // the values reset to initial state
            this.update();
            this.memory.subscribe(this.update.bind(this));
        }
        componentWillUnmount() {
            const component = `_${WrappedComponent.name.toLowerCase()}`;
            this.memory.resetSensory(component); // the values reset to initial state
            this.memory.unsubscribe(this.update.bind(this));
        }
        render() {
            const props = Object.assign(Object.assign(Object.assign({}, this.actions), this.props), this.state);
            return createElement(WrappedComponent, props);
        }
    }
    WrapperComponent.contextTypes = {
        memory: PropTypes.object.isRequired,
    };
    return WrapperComponent;
};

export default HOC;
