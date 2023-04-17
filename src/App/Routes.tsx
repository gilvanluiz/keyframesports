import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { gqlUi } from './Graphiql';
import { Logout } from './Logout';
import { WelcomePage } from './WelcomePage';
import { Payment } from './Payment';
import { ThankYou } from './ThankYou';
import { PlaylistRoutes } from '../Features/Playlists/Routes';
import { FeedbackRoutes } from '../Features/Feedback/Routes';
import { ReportProblem } from '../Features/ProblemReporting/Components/Main';
import { withStyles } from '@material-ui/core';
import { PrivateRoutes } from './PrivateRoutes';
interface IProps {
    isUserSubscribed: boolean;
}

const styles = () => ({
    message: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const notFound = ({ classes }: any) => {
    return <div className={classes.message}>Not found</div>;
};

const NotFound = withStyles(styles)(notFound);

const Routes = ({ isUserSubscribed }: IProps) => (
    <Switch>
        <Route exact path='/__dev' component={gqlUi} />
        <Route exact path='/playlist' component={PlaylistRoutes} />
        <Route exact path='/logout' component={Logout} />
        <Route exact path='/report-problem' component={ReportProblem} />
        <Route exact path='/feedback' component={FeedbackRoutes} />
        <Route exact path='/payments/make-payment' component={Payment} />
        <Route
            exact
            path={['/thank-you/success', '/thank-you/cancel']}
            component={ThankYou}
        />
        <Route exact path='/' component={WelcomePage} />
        <PrivateRoutes isUserSubscribed={isUserSubscribed} />
        <Route path='/404' component={NotFound} />
        <Route path='/' component={NotFound} />
    </Switch>
);

export { Routes };
