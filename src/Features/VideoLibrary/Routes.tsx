import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { VideoListView } from './Components/VideoListView';
import { VideoLibraryContextProvider } from './State';

export const VideoLibraryRoutes = () => (
    <VideoLibraryContextProvider>
        <DndProvider backend={HTML5Backend}>
            <Switch>
                <Route component={VideoListView} />
            </Switch>
        </DndProvider>
    </VideoLibraryContextProvider>
);
