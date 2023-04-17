import * as React from 'react';
import { useState } from 'react';
import {
    IPlaylistState,
    UpdatePlaylistState,
    PlaylistActionHandler,
    initialPlaylistState,
    PlaylistContext,
    IPlaylistAction,
    reducer,
} from './State';
import { Switch, Route } from 'react-router-dom';
import { PlaylistView } from './Components/PlaylistView';
import { PlaylistMain } from './Components/Main';

export const PlaylistRoutes = ({ match: { path } }: any) => {
    const [playlistState, updateState]: [
        IPlaylistState,
        (f: UpdatePlaylistState) => any
    ] = useState(initialPlaylistState);
    const updatePlaylistState: PlaylistActionHandler = (a: IPlaylistAction) =>
        updateState(reducer(a));
    const stateManager = {
        playlistState,
        updatePlaylistState,
    };
    return (
        <PlaylistContext.Provider value={stateManager}>
            <Switch>
                <Route
                    exact
                    path='/playlists/default'
                    component={PlaylistView}
                />
                <Route component={PlaylistMain} />
            </Switch>
        </PlaylistContext.Provider>
    );
};
