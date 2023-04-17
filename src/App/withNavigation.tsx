import * as React from 'react';
import { withRouter } from 'react-router-dom';

export const withNavigation = (Child: React.ComponentType<any>) => {
    const inner = (props: any) => <Child {...props} />;
    return withRouter(inner);
};
