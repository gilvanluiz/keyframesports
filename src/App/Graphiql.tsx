import * as React from 'react';

export const graphQLFetcher = (graphQLParams: any) => {
    return fetch('https://legalnotice.heroku.com/v1alpha1/graphql', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphQLParams),
    }).then((response) => response.json());
};

export const gqlUi = () => (
    <iframe
        style={{ height: '80vh', width: '80vw' }}
        src='https://legalnotice.herokuapp.com'
    />
);
