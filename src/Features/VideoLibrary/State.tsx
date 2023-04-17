import * as React from 'react';

export interface IVideoLibraryState {
    selectedVideo: any;
    modalsOpened: any;
}

export interface IVideoLibraryStateMgr {
    videoLibraryState: IVideoLibraryState;
    setVideoLibraryState: (newState: IVideoLibraryState) => any;
}

const initialVideoLibraryState = {
    selectedVideo: {},
    modalsOpened: {
        editVideoModal: false,
        deleteVideoModal: false,
    },
};

const VideoLibraryContext = React.createContext({});

interface IProviderProps {
    children: any;
}

export const VideoLibraryContextProvider = ({ children }: IProviderProps) => {
    const [videoLibraryState, setVideoLibraryState]: [
        IVideoLibraryState,
        any
    ] = React.useState(initialVideoLibraryState);
    const videoLibraryStateMgr: IVideoLibraryStateMgr = {
        videoLibraryState,
        setVideoLibraryState,
    };
    return (
        <VideoLibraryContext.Provider value={videoLibraryStateMgr}>
            {...children}
        </VideoLibraryContext.Provider>
    );
};

export const withVideoLibraryState = (Child: React.ComponentType<any>) => (
    props: any
) => {
    return (
        <VideoLibraryContext.Consumer>
            {(value: IVideoLibraryState) => (
                <Child videoLibraryStateMgr={value} {...props} />
            )}
        </VideoLibraryContext.Consumer>
    );
};
