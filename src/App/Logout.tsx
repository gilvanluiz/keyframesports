import * as React from 'react';
import { Redirect } from 'react-router-dom';

export const Logout = () => {
    localStorage.clear();
    document.location.href = '/login';
    return <Redirect to='/login' />;
};
