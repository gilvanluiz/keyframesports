import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactGA from 'react-ga';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { useEffect } from 'react';
import { client } from './App/apolloClient';
import { LocalContextProvider } from './App/LocalState';
import AuthRedirect from './App/AuthRedirect';
import darkTheme from './App/Themes/Dark';
import './index.css';

const gaID: string = process.env.REACT_APP_GOOGLE_ANALYTICS_ID!;

function Root() {
    useEffect(() => ReactGA.initialize(gaID), []);

    return (
        <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>
                <BrowserRouter>
                    <LocalContextProvider>
                        <MuiThemeProvider theme={darkTheme}>
                            <AuthRedirect />
                        </MuiThemeProvider>
                    </LocalContextProvider>
                </BrowserRouter>
            </ApolloHooksProvider>
        </ApolloProvider>
    );
}

ReactDOM.render(<Root />, document.getElementById('root') as HTMLElement);
