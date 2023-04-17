import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import {
    Card,
    CardHeader,
    Avatar,
    IconButton,
    CardContent,
    Typography,
    Divider,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { path } from 'ramda';

const CLIENT_DETAIL = gql`
    query ClientQuery($clientId: uuid!) {
        client(where: { id: { _eq: $clientId } }) {
            first_name
            id
            last_name
            phone
            created_at
        }
    }
`;

const clientCardStyles = (theme: any) => ({
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%',
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
});

export interface IClientCardProps {
    loading?: boolean;
    error?: any;
    data?: any;
    classes?: any;
}
function clientCardComponent({
    loading,
    error,
    data,
    classes,
}: IClientCardProps) {
    if (error) {
        return <p>Error</p>;
    }
    const client: any = path(['client', 0], data);
    return (
        <div>
            {loading && <p>Loading</p>}
            {client && (
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <Avatar
                                aria-label='ClientName'
                                className={classes.avatar}
                            >
                                {client.last_name[0]}
                            </Avatar>
                        }
                        action={
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={`${client.first_name} ${client.last_name}`}
                        subheader={client.created_at.slice(0, 9)}
                    />
                    <CardContent>
                        <Divider />
                        <Typography component='p'>
                            Name: {`${client.first_name} ${client.last_name}`}
                        </Typography>
                        <Divider />
                        <Typography component='p'>
                            Phone: {`${client.phone}`}
                        </Typography>
                        <Divider />
                        <Typography component='p'>
                            Created: {`${client.created_at.slice(0, 9)}`}
                        </Typography>
                        <Divider />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export const CardComponent = withStyles(clientCardStyles)(clientCardComponent);

export interface IClientDetailProps {
    id: string;
}

export function ClientCard({ id }: IClientDetailProps) {
    return (
        <Query
            query={CLIENT_DETAIL}
            variables={{ clientId: id }}
            pollInterval={1000}
        >
            {({ loading, error, data }: any) => (
                <CardComponent error={error} data={data} loading={loading} />
            )}
        </Query>
    );
}
