import HOC from './hoc';
import { select } from './helper';

/**
 *  @public
 *  @desc Wire a component up to the memory. Passes state as props, re-renders on change.
 *  @param {Array} mapStateToProps  Memory state to be mapped the respective props using array with comma seperated values.
 *  @param {Function|Object} [actions] 				Action functions (pure state mappings), or a factory returning them. Every action function gets current state as the first parameter.
 *  @returns {Component} ConnectedComponent
 *  @example
 *    const Foo = connect([foo, bar])( ({ foo, bar }) => <div /> )
 *  @example
 *    const actions = { someAction }
 *    const Foo = connect([foo, bar], actions)( ({ foo, bar, someAction }) => <div /> )
 *  @example
 *    @connect( state => ({ foo: state.foo, bar: state.bar }) )
 *    export class Foo { render({ foo, bar }) { } }
 */
const connect = function(mapStateToProps, actions) {
    mapStateToProps = Array.isArray(mapStateToProps) ? mapStateToProps : [];
    mapStateToProps = select(mapStateToProps);

    return WrappedComponent => {
        return HOC(WrappedComponent, mapStateToProps, actions);
    };
};

export default connect;
