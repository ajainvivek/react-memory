import HOC from './hoc';
import { select } from './helper';

const connect = function(mapStateToProps, actions) {
    mapStateToProps = Array.isArray(mapStateToProps) ? mapStateToProps : [];
    mapStateToProps = select(mapStateToProps);

    return WrappedComponent => {
        return HOC(WrappedComponent, mapStateToProps, actions);
    };
};

export default connect;