import {
    Box,
    Card,
    CardActions,
    CardContent,
    Collapse,
    IconButton,
    withStyles,
} from '@material-ui/core';
import gql from 'graphql-tag';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { IQueryResponse } from '../VideoLibrary/Components/VideoListView/types';
import { TelestratedVideosStyles } from './TelestratedVideosStyles';
import { s3KeyToUrl } from 'src/Utilities/AwsVideoLibrary';
import { withApollo } from 'react-apollo';

interface IProps {
    client: any;
    classes: any;
}
const getQuery = () => gql`
    query MyVideos ($limit: Int, $offset: Int, $email: String!) {
        video (limit: $limit, offset: $offset, where: {user_creator_email: {_eq: $email}}, order_by: {${'created_at'}: ${'desc'}}) {
            created_at
            subtitle
            duration
            id
            s3_key
            title
        }
    }
`;

interface IUser {
    name: string;
    expanded: boolean;
    videos: any[];
}

const usersList: IUser[] = [
    { name: 'james@keyframesports.com', expanded: false, videos: [] },
    { name: 'hr@abz.agency', expanded: false, videos: [] },
    { name: 'hr10@abz.agency', expanded: false, videos: [] },
    { name: 'hr11@abz.agency', expanded: false, videos: [] },
    { name: 'hr99@abz.agency', expanded: false, videos: [] },
];

const telestratedVideos: React.FC<IProps> = ({ classes, client }) => {
    const [users, setUsersData] = useState(usersList);

    useEffect(() => {
        getUserData();
    }, []);

    async function getUserData() {
        const query = getQuery();
        const newUsersList: IUser[] = await Promise.all(
            usersList.map(async (userData) => {
                await client
                    .query({
                        query,
                        variables: {
                            email: userData.name,
                            limit: 12,
                            offset: 0,
                        },
                    })
                    .then(({ data, error }: IQueryResponse) => {
                        const payload = data.video || [];
                        userData.videos = [...payload];
                    });
                return userData;
            })
        );
        setUsersData(newUsersList);
    }

    function handleExpandClick(user: IUser) {
        const newUsersList: IUser[] = usersList.map((userData) => {
            if (userData.name === user.name) {
                userData.expanded = !userData.expanded;
            }
            return userData;
        });
        setUsersData(newUsersList);
    }

    return (
        <Box className={classes.container}>
            <Box className={classes.header}>Users</Box>
            <Box className={classes.content}>
                {users.map((userData, index) => (
                    <Card className={classes.userCard} key={index}>
                        <CardContent>
                            <p>{userData.name}</p>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: userData.expanded,
                                })}
                                onClick={() => handleExpandClick(userData)}
                                aria-expanded={userData.expanded}
                                aria-label='show more'
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        </CardActions>
                        <Collapse
                            in={userData.expanded}
                            timeout='auto'
                            unmountOnExit
                            classes={{ wrapperInner: classes.collapse }}
                        >
                            {userData.videos.map((video, videoIndex) => (
                                <Box
                                    className={classes.videoContainer}
                                    key={index + videoIndex}
                                >
                                    <video
                                        crossOrigin='anonymous'
                                        preload='metadata'
                                        controls={true}
                                        width='100%'
                                        height='100%'
                                    >
                                        <source
                                            src={
                                                s3KeyToUrl(video.s3_key)
                                                    .video_url + '#t=0.5'
                                            }
                                            type='video/mp4'
                                        />
                                    </video>
                                </Box>
                            ))}
                        </Collapse>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export const TelestratedVideos = withApollo(
    withStyles(TelestratedVideosStyles)(telestratedVideos)
);
