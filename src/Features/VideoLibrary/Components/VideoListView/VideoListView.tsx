import * as React from 'react';
import gql from 'graphql-tag';
import { useEffect, useRef, useReducer } from 'react';
import {
    Box,
    Button,
    Select,
    MenuItem,
    withStyles,
    WithStyles as IWithStyles,
} from '@material-ui/core';
import { withApollo } from 'react-apollo';
import { compose } from 'fp-ts/lib/function';
import { Lens } from 'monocle-ts';
import { IVideoListView, IQueryResponse, Sort } from './types';
import { withVideoLibraryState, IVideoLibraryState } from '../../State';
import { reducer, initialState } from './reducer';
import { withLocalState } from '../../../../App/LocalState';
import { VideoTile } from './Components/VideoTile';
import { VideoUploadDialog } from '../VideoUploadDialog';
import { ModalDialog } from '../ModalDialog';
import { withNavigation } from '../../../../App/withNavigation';
import { IClip } from '../../../../Assets/videoVideoLibrary';
import UploadIcon from './../../../../Assets/upload.png';
import {
    gameFootageDeleteVideo,
    gameFootageEditVideo,
    gameFootageOpened,
    gameFootagePageUnmounted,
    gameFootageSort,
    gameFootageUploadOpened,
} from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { styles } from './styles';
import { useWindowSize } from './useWindowSize';

const alephURI = process.env.REACT_APP_ALEPH_URI;

const getQuery = ([field, direction]: Sort) => gql`
    query MyVideos ($limit: Int, $offset: Int, $email: String!) {
        video (limit: $limit, offset: $offset, where: {user_creator_email: {_eq: $email}}, order_by: {${field}: ${direction}}) {
            created_at
            subtitle
            duration
            id
            s3_key
            title
        }
    }
`;

const sorts = [
    {
        name: 'Title (A - Z)',
        value: ['title', 'desc'],
    },
    {
        name: 'Title (Z - A)',
        value: ['title', 'asc'],
    },
    {
        name: 'Created at (low > high)',
        value: ['created_at', 'desc'],
    },
    {
        name: 'Created at (high > low)',
        value: ['created_at', 'asc'],
    },
    {
        name: 'Size (low > high)',
        value: ['size', 'desc'],
    },
    {
        name: 'Size (high > low)',
        value: ['size', 'asc'],
    },
    {
        name: 'Duration (low > high)',
        value: ['duration', 'asc'],
    },
    {
        name: 'Duration (high > low)',
        value: ['duration', 'desc'],
    },
];

const editVideoModalFields = [
    {
        label: 'Title',
        name: 'title',
        required: true,
    },
    {
        label: 'Subtitle',
        name: 'subtitle',
        required: false,
    },
];

const pagination = {
    limit: 12,
    offset: 0,
};

const VideoList = ({
    classes,
    history,
    client,
    videoLibraryStateMgr,
    localStateMgr,
}: IVideoListView & IWithStyles) => {
    const email = localStorage.getItem('username') as string;

    const { videoLibraryState, setVideoLibraryState } = videoLibraryStateMgr;
    const { selectedVideo } = videoLibraryState;
    const [state, dispatch] = useReducer(reducer, initialState);
    const videoListRef = useRef<HTMLDivElement>(null);
    const windowWidth = useWindowSize()[0];
    const loadVideos = (
        action:
            | 'ON_LOAD_MORE_VIDEOS'
            | 'ON_LOAD_VIDEOS'
            | 'ON_ERROR'
            | 'ON_UPLOAD_VIDEO',
        limit: number,
        offset: number
    ) => {
        const query = getQuery(state.sort);

        client
            .query({
                query,
                variables: {
                    email,
                    limit,
                    offset,
                },
            })
            .then(({ data, error }: IQueryResponse) => {
                console.log(data);
                const payload = data.video || [];
                const type = error ? 'ON_ERROR' : action;

                dispatch({
                    type,
                    payload,
                });
            });
    };

    useEffect(() => {
        loadVideos('ON_LOAD_VIDEOS', pagination.limit, pagination.offset);
    }, [state.sort]);

    useEffect(() => {
        sendUserEvent(gameFootageOpened, window.location.href);
        return () => UserEventOnUnmount();
    }, []);

    useEffect(() => {
        handleToggleButton();
        window.addEventListener('resize', handleToggleButton);
        return () => window.removeEventListener('resize', handleToggleButton);
    }, []);

    function handleToggleButton() {
        if (window.innerWidth < 870) {
            return dispatch({
                type: 'ON_UPLOAD_BUTTON_TEXT_REMOVE',
                payload: false,
            });
        }
        return dispatch({ type: 'ON_UPLOAD_BUTTON_TEXT_ADD', payload: false });
    }

    const UserEventOnUnmount = () => {
        return history.location.pathname !== '/video-library/'
            ? sendUserEvent(gameFootagePageUnmounted, window.location.href)
            : undefined;
    };

    const openModal = (
        modalName: 'editVideoModal' | 'deleteVideoModal',
        clip: IClip
    ) => (e: React.MouseEvent) => {
        e.preventDefault();
        setVideoLibraryState(
            compose(
                Lens.fromProp<IVideoLibraryState>()('selectedVideo').set(clip),
                Lens.fromPath<IVideoLibraryState>()([
                    'modalsOpened',
                    modalName,
                ]).set(true)
            )(videoLibraryState)
        );
    };

    const closeModal = (modalName: string) => {
        setVideoLibraryState(
            Lens.fromPath<IVideoLibraryState>()([
                'modalsOpened',
                modalName,
            ]).set(false)(videoLibraryState)
        );
    };

    const deleteVideo = async () => {
        sendUserEvent(
            gameFootageDeleteVideo,
            window.location.href,
            selectedVideo.id
        );
        const response = await fetch(
            alephURI + '/api-v1/video/' + selectedVideo.id,
            {
                method: 'delete',
            }
        );

        if (response.status === 200) {
            dispatch({
                type: 'ON_DELETE_VIDEO',
                payload: selectedVideo.id,
            });
            setVideoLibraryState(
                compose(
                    Lens.fromProp<IVideoLibraryState>()('selectedVideo').set(
                        {}
                    ),
                    Lens.fromPath<IVideoLibraryState>()([
                        'modalsOpened',
                        'deleteVideoModal',
                    ]).set(false)
                )(videoLibraryState)
            );
        }
    };

    const editVideo = async (form: any) => {
        sendUserEvent(
            gameFootageEditVideo,
            window.location.href,
            selectedVideo.id
        );
        try {
            await fetch(
                process.env.REACT_APP_ALEPH_URI +
                    '/api-v1/video/rename/' +
                    selectedVideo.id,
                {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: form.title,
                        subtitle: form.subtitle,
                    }),
                }
            );
        } catch (error) {
            console.log(error);
        }

        closeModal('editVideoModal');
    };

    const openUploadModal = () => {
        sendUserEvent(gameFootageUploadOpened, window.location.href);
        dispatch({
            type: 'TOGGLE_UPLOAD_MODAL',
            payload: true,
        });
    };

    const closeUploadModal = () => {
        dispatch({
            type: 'TOGGLE_UPLOAD_MODAL',
            payload: false,
        });
    };

    const onVideoUpload = (id: string, title: string) =>
        localStateMgr.dispatch({
            type: 'ON_UPLOAD_START',
            video: {
                id,
                title,
                progress: 0,
            },
        });

    const onUploadProgress = (id: string, percentage: number) =>
        localStateMgr.dispatch({
            type: 'ON_UPLOAD_PROGRESS',
            videoID: id,
            percentage,
        });

    const onStartConversion = (id: string) =>
        localStateMgr.dispatch({
            type: 'ON_START_CONVERSION',
            videoID: id,
        });

    const onVideoUploadComplete = (id: string) => {
        loadVideos('ON_UPLOAD_VIDEO', 1, 0);
        localStateMgr.dispatch({
            type: 'ON_UPLOAD_SUCCESS',
            videoID: id,
        });
    };

    const changeSort = (event: React.ChangeEvent<{ value: Sort }>) => {
        sendUserEvent(gameFootageSort, window.location.href);
        dispatch({
            type: 'CHANGE_SORT',
            payload: event.target.value,
        });
    };

    const getEditVideoFields = () => {
        const fields = editVideoModalFields.map((field: any) => {
            return {
                ...field,
                defaultValue: selectedVideo[field.name] || '',
            };
        });

        return fields;
    };

    const renderValue = () => {
        const selectedSort = sorts.find(
            (sort) =>
                state.sort[0] === sort.value[0] &&
                state.sort[1] === sort.value[1]
        );
        return selectedSort?.name;
    };

    const onScroll = () => {
        if (videoListRef.current) {
            const currentPosition =
                videoListRef.current.scrollHeight -
                videoListRef.current.clientHeight;
            const lastPosition = videoListRef.current.scrollTop;

            if (currentPosition === lastPosition) {
                loadVideos(
                    'ON_LOAD_MORE_VIDEOS',
                    pagination.limit,
                    state.videos.length
                );
            }
        }
    };

    return state.loading ? (
        <Box className={classes.message}>Loading...</Box>
    ) : state.error ? (
        <Box className={classes.message}>Something went wrong.</Box>
    ) : (
        <Box className={classes.container}>
            <Box className={classes.header}>
                <Box className={classes.title}>Game Footage</Box>
                <Box className={classes.sort}>
                    <Box component='span'>Sort by:</Box>
                    <Select
                        value={windowWidth > 990 ? state.sort : ''}
                        renderValue={renderValue}
                        onChange={changeSort}
                        label='Sort'
                    >
                        {sorts.map((sort, index) => (
                            <MenuItem key={index} value={sort.value}>
                                {sort.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Button
                    aria-label='Add'
                    className={classes.uploadButton}
                    onClick={openUploadModal}
                    startIcon={
                        <img
                            src={UploadIcon}
                            alt='upload video'
                            width='24'
                            height='24'
                        />
                    }
                >
                    {state.uploadVideoButtonText ? 'Upload Video' : ''}
                </Button>
            </Box>
            <div
                className={classes.scrollBar}
                ref={videoListRef}
                onScroll={onScroll}
            >
                {state.videos.map(
                    (clip: IClip, index: number, videos: IClip[]) => (
                        <VideoTile
                            key={index}
                            index={index}
                            clip={clip}
                            openModal={openModal}
                            videos={state.videos}
                            rootDispatch={dispatch}
                        />
                    )
                )}
            </div>
            <VideoUploadDialog
                open={state.uploadModal.open}
                showScreenshot={state.uploadModal.videoUploaded}
                onVideoUpload={onVideoUpload}
                onVideoUploadComplete={onVideoUploadComplete}
                onStartConversion={onStartConversion}
                closeModal={closeUploadModal}
                onUploadProgress={onUploadProgress}
            />
            <ModalDialog
                open={videoLibraryState.modalsOpened.editVideoModal}
                title={'Edit the video'}
                fields={getEditVideoFields()}
                onConfirm={editVideo}
                onClose={() => closeModal('editVideoModal')}
            />
            <ModalDialog
                open={videoLibraryState.modalsOpened.deleteVideoModal}
                title={'Delete the video'}
                width={'300px'}
                confirmButtonText={'Delete'}
                onConfirm={deleteVideo}
                onClose={() => closeModal('deleteVideoModal')}
            />
        </Box>
    );
};

export const VideoListView = compose(
    withStyles(styles),
    withNavigation,
    withVideoLibraryState,
    withApollo,
    withLocalState
)(VideoList);
