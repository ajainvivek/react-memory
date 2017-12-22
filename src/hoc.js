import React, { Component } from 'react';

const HOC = (WrappedComponent, mapStateToProps, actions) => {
    return class WrapperComponent extends Component {
        constructor(props) {
            super(props);
            this.memory = this.context.memory;
            this.state = mapStateToProps(store ? store.getState() : {});
            this.actions = actions ? mapActions(actions, this.memory) : { memory };
        }
        update() {
            let mapped = mapStateToProps(this.store ? this.store.getState() : {});
            for (let i in mapped) {
                if (mapped[i] !== this.state[i]) {
                    state = mapped;
                    return this.forceUpdate();
                }
            }

            for (let i in state) {
                if (mapped[i] !== this.state[i]) {
                    state = mapped;
                    return this.forceUpdate();
                }
            }
        }
        componentDidMount() {
            this.update();
            store.subscribe(this.update);
        }
        componentWillUnmount() {
            store.unsubscribe(this.update);
        }
        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};

export default HOC;
