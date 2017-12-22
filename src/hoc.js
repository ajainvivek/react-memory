import React, { Component, createElement } from 'react';

const HOC = (WrappedComponent, mapStateToProps, actions) => {
    class WrapperComponent extends Component {
        constructor(props) {
            super(props);
            this.memory = this.context.memory;
            this.state = mapStateToProps(this.memory ? this.memory.getState() : {});
            this.actions = actions ? mapActions(actions, this.memory) : { memory };
        }
        update() {
            let mapped = mapStateToProps(this.memory ? this.memory.getState() : {});
            for (let i in mapped) {
                if (mapped[i] !== this.state[i]) {
                    this.state = mapped;
                    return this.forceUpdate();
                }
            }

            for (let i in state) {
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
            const props = Object.assign(Object.assign(Object.assign({}, boundActions), this.props), this.state);
            const WrappedComponent = this.props.child;
            return createElement(WrappedComponent, props);
        }
    }
    return createElement(WrapperComponent, { child: WrappedComponent });
};

export default HOC;
