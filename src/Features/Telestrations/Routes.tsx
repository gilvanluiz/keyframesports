import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { EditTelestration } from './Components/EditTelestration';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { withStyles } from '@material-ui/core';
import { useHistory } from 'react-router';

const GET_VIDEO = gql`
    query Video($videoID: uuid) {
        video(where: { id: { _eq: $videoID } }) {
            created_at
            subtitle: description
            id
            s3_key
            title
        }
    }
`;

const styles = () => ({
    message: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const telestrationRoutes = ({ classes }: any) => {
    const history = useHistory();
    const videoID = history.location.pathname.split('/').pop();
    const { data, loading, error, refetch } = useQuery(GET_VIDEO, {
        variables: {
            videoID,
        },
    });

    React.useEffect(() => {
        refetch();
    }, [videoID]);

    return (
        <Route
            render={(RouterProps) =>
                loading ? (
                    <div className={classes.message}>Loading...</div>
                ) : !error ? (
                    <EditTelestration
                        data={data}
                        loading={loading}
                        videoID={videoID}
                    />
                ) : (
                    <Redirect to='/404' />
                )
            }
        />
    );
};

export const TelestrationRoutes = withStyles(styles)(telestrationRoutes);
