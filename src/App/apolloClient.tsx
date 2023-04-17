import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

const hasuraAdminSecret = process.env.REACT_APP_HASURA_ADMIN_SECRET;
const hasuraUri = process.env.REACT_APP_HASURA_URI;

if (!hasuraAdminSecret || !hasuraUri) {
    throw Error('Hasura environment info missing. Check your .env file.');
}

const getAuthHeader = (): string | null => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (username && password) {
        const b64creds = btoa(`${username}:${password}`);
        return `Basic ${b64creds}`;
    }
    return null;
};

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists

    // return the headers to the context so httpLink can read them
    const authHeader = getAuthHeader();
    if (authHeader) {
        return {
            headers: {
                ...headers,
                Authorization: authHeader,
            },
        };
    } else {
        return { headers };
    }
});

const httpLink = createHttpLink({ uri: hasuraUri });

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export { client, getAuthHeader };
