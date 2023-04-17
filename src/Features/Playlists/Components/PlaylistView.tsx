import * as React from 'react';
import { VideoList } from './VideoList';
import { DetailCol } from './PlaylistDetailCol';
import { withStyles } from '@material-ui/core';
import {
    IPlaylistStateManager,
    PlaylistContext,
} from '../State';

const styles = () => ({
    root: {
        display: 'flex',
    },
    detailCol: {
        width: '300px',
    },
    listCol: {
        paddingLeft: '40px',
        width: '100%',
        maxWidth: '760px',
    },
    fabRow: {
        position: 'fixed' as 'fixed',
        bottom: '15px',
        right: '15px',
    },
    fab: {
        backgroundColor: '#3f7fb594',
        '&:hover': {
            backgroundColor: '#3f7fb5ab',
        },
    },
});

interface IProps {
    classes: any;
}

const playlistMain = ({ classes }: IProps) => {
    return (
        <PlaylistContext.Consumer>
            {(stateManager) => (
                <div className={`playlist-main ${classes.root}`}>
                    <div className={classes.detailCol}>
                        <DetailCol />
                    </div>
                    <div className={classes.listCol}>
                        <VideoList
                            stateManager={stateManager as IPlaylistStateManager}
                        />
                    </div>
                </div>
            )}
        </PlaylistContext.Consumer>
    );
};

export const PlaylistView = withStyles(styles)(playlistMain);
