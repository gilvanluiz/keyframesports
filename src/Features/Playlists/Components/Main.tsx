import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { withStyles, TextField, Chip, Fab } from '@material-ui/core';
import { PlaylistDetailCard } from './PlaylistDetailCard';
import { PlaylistContext } from '../State';
import Image1 from '../../../Assets/kick.jpg';
import Image2 from '../../../Assets/field.jpg';
import Image3 from '../../../Assets/goodCatch.jpg';
import Image4 from '../../../Assets/soccerimage.jpg';
import { NewPlaylistDialog } from './NewPlaylistDialog';
import {
    IPlaylistStateManager,
    IPlaylist,
    setSearchFilterAction,
    openNewPlaylistModalAction,
    openPlaylistShareDialogAction,
} from '../State';
import { ShareDialog } from './SharePlaylistLinkDialog';

const styles = () => ({
    root: {},
    topBar: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
    },
    searchBox: {
        marginTop: 0,
    },
    searchInput: {
        height: 1,
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
    playlists: {
        paddingTop: 30,
        display: 'flex',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'flex-start' as 'flex-start',
        flexWrap: 'wrap' as 'wrap',
    },
});

interface IProps {
    classes: any;
}

const defaultImages = [Image1, Image2, Image3, Image4];

const playlistMain = ({ classes }: IProps) => {
    const openCreatePLModal = (stateManager: any) => {
        const action = openNewPlaylistModalAction();
        stateManager.updatePlaylistState(action);
    };
    const dateToImage = (d: Date) => {
        const idx = d.getTime() % 4;
        return defaultImages[idx];
    };
    const cards = (stateManager: any) => {
        const openShareDialog = (s: string) => () =>
            stateManager.updatePlaylistState(openPlaylistShareDialogAction(s));
        const searchString = stateManager.playlistState.search.filter;
        return stateManager.playlistState.playlists
            .filter((p: IPlaylist) =>
                p.title.toLowerCase().includes(searchString.toLowerCase())
            )
            .map((c: IPlaylist) => (
                <PlaylistDetailCard
                    key={c.title}
                    clipCount={c.clipCount}
                    openShareDialog={openShareDialog(c.title)}
                    createdAt={c.createdAt}
                    imageSrc={c.imageSrc || dateToImage(c.createdAt)}
                    title={c.title}
                />
            ));
    };
    const onSearch = (s: IPlaylistStateManager) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => s.updatePlaylistState(setSearchFilterAction(e.currentTarget.value));
    const chipText = (stateManager: IPlaylistStateManager) => {
        const { playlists } = stateManager.playlistState;
        const numPlaylists = playlists.length;
        return numPlaylists === 1 ? '1 Playlist' : numPlaylists + ' Playlists';
    };
    return (
        <PlaylistContext.Consumer>
            {(stateManager) => (
                <div className={`playlist-main ${classes.root}`}>
                    <div className={classes.topBar}>
                        <Chip
                            label={chipText(
                                stateManager as IPlaylistStateManager
                            )}
                        />
                        <TextField
                            id='playlist-search'
                            className={classes.searchBox}
                            onChange={onSearch(
                                stateManager as IPlaylistStateManager
                            )}
                            margin='dense'
                            InputProps={{
                                classes: {
                                    input: classes.searchInput,
                                },
                            }}
                            variant={'outlined'}
                        />
                    </div>
                    <div className={classes.playlists}>
                        {cards(stateManager as IPlaylistStateManager)}
                    </div>
                    <div className={classes.fabRow}>
                        <Fab
                            color='primary'
                            aria-label='Add'
                            className={classes.fab}
                            onClick={() => openCreatePLModal(stateManager)}
                        >
                            <AddIcon />
                        </Fab>
                    </div>
                    <NewPlaylistDialog
                        stateManager={stateManager as IPlaylistStateManager}
                    />
                    <ShareDialog
                        playlistStateMgr={stateManager as IPlaylistStateManager}
                    />
                </div>
            )}
        </PlaylistContext.Consumer>
    );
};

export const PlaylistMain = withStyles(styles)(playlistMain);
