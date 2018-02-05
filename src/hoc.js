import React, { Component, createElement } from 'react';
import { mapActions, generateUniqueId, camelizeLetters } from './helper';
import PropTypes from 'prop-types';

const HOC = (WrappedComponent, mapStateToProps, actions) => {
    class WrapperComponent extends Component {
        constructor(props, context) {
            super(props);
            this.memory = context.memory;
            this.state = mapStateToProps(this.memory ? this.memory.getState() : {});
            this.actions = actions ? mapActions(actions, this.memory) : this.memory;
            this.sensoryId = Object.keys(this.state).filter(key => key.indexOf('_sensory') >= 0)[0];
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
            const component = `_${camelizeLetters(WrappedComponent.name)}`;
            this.update();
            this.memory.resetSensory(component, this.sensoryId); // the values reset to initial state
            this.memory.subscribe(this.update.bind(this));
        }
        componentWillUnmount() {
            const component = `_${camelizeLetters(WrappedComponent.name)}`;
            this.memory.removeSensoryInstance(this.sensoryId); // remove sensory instance
            this.memory.unsubscribe(this.update.bind(this));
        }
        render() {
            if (!this.state[this.sensoryId]) {
                const component = `_${camelizeLetters(WrappedComponent.name)}`;
                this.state[this.sensoryId] = this.memory.snapshot('sensory')[component];
            }
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
