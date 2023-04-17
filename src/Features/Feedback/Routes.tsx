import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { FeedbackListView } from './ListView';

export const FeedbackRoutes = () => (
    <Switch>
        <Route component={FeedbackListView} />
    </Switch>
);
