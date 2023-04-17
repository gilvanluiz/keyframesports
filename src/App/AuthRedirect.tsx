import * as React from 'react';
import * as ReactGA from 'react-ga';
import * as uuid from 'uuid/v4';
import {
    Switch,
    Route,
    Redirect,
    withRouter,
    RouteComponentProps,
} from 'react-router-dom';
import { useEffect } from 'react';
import { LoginAndRegister } from '../Features/UserManagement/components/LoginAndRegister';
import Main from './Main';
import Referral from './Referral';
import { Notification } from './Notification';

const getReferralId = () => {
    const prevReferralId = localStorage.getItem('referralId');
    return prevReferralId || uuid();
};

const authRedirect = ({ location }: RouteComponentProps) => {
    const username = localStorage.getItem('username');
    const searchParams = new URLSearchParams(location.search);
    const affiliateId = searchParams.get('affiliate-id');
    const referralId = getReferralId();

    if (affiliateId) {
        localStorage.setItem('affiliateId', affiliateId);
        localStorage.setItem('referralId', referralId);
        localStorage.setItem('referralTimestamp', `${Date.now()}`);
    }

    useEffect(() => ReactGA.pageview(location.pathname + location.search), [
        location,
    ]);

    return (
        <div>
            <Switch>
                <Route
                    exact
                    path='/login'
                    render={() =>
                        username ? <LoginAndRegister /> : <Redirect to='/' />
                    }
                    component={LoginAndRegister}
                />
                <Route exact path='/register' component={LoginAndRegister} />
                <Route exact path='/referral' component={Referral} />
                <Route
                    render={() =>
                        username ? <Main /> : <Redirect to='/login' />
                    }
                />
            </Switch>
            <Notification />
        </div>
    );
};

export default withRouter(authRedirect);
