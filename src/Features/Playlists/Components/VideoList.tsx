import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Paper,
    List,
    ListItem,
    IconButton,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from '@material-ui/core';
import {
    IPlaylistStateManager,
    selectClipAction,
    shareVideoLinkAction,
    IClip,
} from '../State';
import ShareIcon from '@material-ui/icons/Share';

import { VideoThumbnail } from './VideoThumbnail';
import { ShareDialog } from './ShareVideoLinkDialog';
import { VideoPlayer } from './VideoPlayer';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import screenshotImg from '../../../Assets/uploadedScreenshot2.png';

const TELESTRATION_QUERY = gql`
    query MyQuery($user_creator_email: String) {
        telestration_telestration_video(
            where: { user_creator_email: { _eq: $user_creator_email } }
        ) {
            id
            s3_key
            title
            description
            created_at
            user_creator_email
        }
    }
`;

interface IToListItemArgs {
    x: IClip;
    stateManager: IPlaylistStateManager;
}
const toListItem = ({
    x,
    stateManager: { updatePlaylistState },
}: IToListItemArgs) => {
    const username = localStorage.getItem('username') || '';
    if (x.user_creator_email !== username) {
        return null;
    }
    const playVideo = () => updatePlaylistState(selectClipAction(x));
    const shareVideo = () => updatePlaylistState(shareVideoLinkAction(x));
    return (
        <ListItem
            alignItems='flex-start'
            button
            onClick={playVideo}
            key={x.title}
        >
            <VideoThumbnail src={screenshotImg} />
            <ListItemText
                primary={x.title}
                secondary={
                    <React.Fragment>
                        <Typography component='span' color='textPrimary'>
                            {x.description}
                        </Typography>
                    </React.Fragment>
                }
            />
            <ListItemSecondaryAction>
                <IconButton aria-label='share' onClick={shareVideo}>
                    <ShareIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

const videoListStyles = () => ({
    root: {
        paddingLeft: '30px',
    },
    avatar: {
        width: '70px',
        borderRadius: '6%',
    },
});
interface IVideoListProps {
    classes: any;
    stateManager: IPlaylistStateManager;
}
const videoList = ({ stateManager }: IVideoListProps) => {
    const clips = (data: any): IClip[] => data.telestration_telestration_video;
    return (
        <Query query={TELESTRATION_QUERY} pollInterval={2000}>
            {({ loading, data, error }: any) => {
                if (loading) {
                    return <p>'loading'</p>;
                } else if (error) {
                    return <p>error</p>;
                } else {
                    return (
                        <div>
                            <VideoPlayer
                                clips={clips(data)}
                                stateManager={stateManager}
                            />
                            <Paper>
                                <List>
                                    {clips(data).map((x: IClip) =>
                                        toListItem({ x, stateManager })
                                    )}
                                </List>
                            </Paper>
                            <ShareDialog playlistStateMgr={stateManager} />
                        </div>
                    );
                }
            }}
        </Query>
    );
};

export const VideoList = withStyles(videoListStyles)(videoList);
