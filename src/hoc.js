import React, {
    Component,
    createElement
} from 'react';
import PropTypes from 'prop-types';

const HOC = (WrappedComponent, mapStateToProps, actions) => {
    class WrapperComponent extends Component {
        constructor(props, context) {
            super(props);
            this.memory = context.memory;
            this.state = mapStateToProps(this.memory ? this.memory.getState() : {});
            this.actions = actions ? mapActions(actions, this.memory) : this.memory;
        }
        update() {
            let mapped = mapStateToProps(this.memory ? this.memory.getState() : {});
            for (let i in mapped) {
                if (mapped[i] !== this.state[i]) {
                    this.state = mapped;
                    return this.forceUpdate();
                }
            }

            for (let i in this.state) {
                if (mapped[i] !== this.state[i]) {
                    this.state = mapped;
                    return this.forceUpdate();
                }
            }
        }
        componentDidMount() {
            this.update();
            this.memory.subscribe(this.update);
        }
        componentWillUnmount() {
            this.memory.unsubscribe(this.update);
        }
        render() {
            const props = Object.assign(Object.assign(Object.assign({}, this.actions), this.props), this.state);
            return createElement(WrappedComponent, props);
        }
    }
    WrapperComponent.contextTypes = {
        memory: PropTypes.object.isRequired
    };
    return WrapperComponent;
};

export default HOC;