import * as React from 'react';
import gql from 'graphql-tag';
import {
    Divider,
    Drawer,
    Avatar,
    withStyles,
    WithStyles as IWithStyles,
    Typography,
} from '@material-ui/core';
import { useEffect, useReducer, useCallback, useState } from 'react';
import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
} from '@material-ui/icons';
import { RouteComponentProps as IRouter } from 'react-router-dom';
import { compose } from 'fp-ts/lib/function';
import { useQuery } from 'react-apollo-hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { reducer, initialState } from './reducer';
import { IVideo } from './types';
import { Video } from './Components/Video';
import { UploadButton } from './Components/UploadButton';
import { DownloadDeleteButtons } from './Components/DownloadDeleteButtons';
import { VideoUploadDialog } from './Components/VideoUploadDialog';
import { ModalDialog } from './Components/ModalDialog';
import {
    withLocalState,
    ILocalStateMgr,
    IQueuedUpload,
} from '../../App/LocalState';

import {
    changeVideoAction,
    withTelestrationState,
} from '../Telestrations/State';

import { s3KeyToUrl, downloadFile } from '../../Utilities/Aws';
import keyframeLogo from '../../Assets/Keyframe_Logo_White_Transparent_Cute.png';
import { styles } from './GameFootageStyle';
import {
    gameFootageDeleteVideo,
    gameFootageOpened,
    gameFootagePageUnmounted,
    gameFootageUploadOpened,
    gameFootageClickedTelestrate,
} from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { ITelestrationStateMgr } from '../Telestrations/Types';

const email = localStorage.getItem('username');
const alephURI = process.env.REACT_APP_ALEPH_URI;
const GET_VIDEOS = gql`
    query MyVideos($email: String!) {
        video(where: { user_creator_email: { _eq: $email } }) {
            created_at
            subtitle
            id
            s3_key
            title
        }
    }
`;

interface IProps extends IWithStyles, IRouter {
    localStateMgr: ILocalStateMgr;
    telestrationStateMgr: ITelestrationStateMgr;
}

const gameFootage = ({
    classes,
    history,
    location,
    localStateMgr,
    telestrationStateMgr,
}: IProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { data, loading, refetch } = useQuery(GET_VIDEOS, {
        variables: {
            email,
        },
    });
    const { dispatchAction } = telestrationStateMgr;
    useEffect(() => {
        if (!loading) {
            dispatch({ type: 'SET_VIDEOS', videos: data.video });
        }
    }, [data]);

    useEffect(() => {
        sendUserEvent(gameFootageOpened, window.location.href);
        return () => UserEventOnUnmount();
    }, []);

    const UserEventOnUnmount = () => {
        return history.location.pathname !== '/game-footage/'
            ? sendUserEvent(gameFootagePageUnmounted, window.location.href)
            : undefined;
    };

    const deleteVideo = async (videoID: string | null) => {
        if (videoID) {
            sendUserEvent(
                gameFootageDeleteVideo,
                window.location.href,
                videoID
            );
            const response = await fetch(
                alephURI + '/api-v1/video/' + videoID,
                {
                    method: 'delete',
                }
            );
            if (response.status === 200) {
                dispatch({
                    type: 'VIDEO_DELETED',
                    videoID,
                });
                if (location.pathname.includes(videoID)) {
                    history.push('/game-footage');
                }
            }
        } else {
            state.videos.forEach((video) => {
                if (video.checked) {
                    deleteVideo(video.id);
                }
            });
        }
    };

    const onCheckVideo = (videoID: string) =>
        dispatch({
            type: 'ON_CHECK_VIDEO',
            videoID,
        });

    const onUncheckVideos = () =>
        dispatch({
            type: 'ON_UNCHECK_VIDEOS',
        });

    const onSelectVideo = (videoID: string) => {
        sendUserEvent(
            gameFootageClickedTelestrate,
            window.location.href,
            videoID
        );

        dispatchAction(changeVideoAction(videoID));

        history.push(`/mode/pro/telestrations/${videoID}`);

        dispatch({
            type: 'ON_SELECT_VIDEO',
            videoID,
        });
    };

    const onDeleteVideo = (
        multiply: boolean,
        title?: string,
        videoID?: string
    ) => {
        const partText = multiply
            ? `videos (${state.videos.filter((video) => video.checked).length})`
            : title;
        const fullText = `Are you sure you want to delete ${partText}?\n(This can't be undone)`;

        dispatch({
            type: 'ON_DELETE_VIDEO',
            text: fullText,
            videoID: videoID || '',
        });
    };

    const onDownloadStart = (video: IVideo) => {
        const { video_url } = s3KeyToUrl(video.s3_key);
        onStartDownloading(undefined, {
            id: video.id,
            title: video.title,
            downloading: true,
        });
        downloadFile({
            name: video.title,
            videoURL: video_url,
            onSuccess: () => {
                onUploadSuccess(video.id);
                onDownloadSuccess(video.id);
            },
        });
    };

    const onDownloadSuccess = (videoID: string) =>
        dispatch({
            type: 'ON_DOWNLOAD_SUCCESS',
            videoID,
        });

    const onUploadStart = (title: string, video: File, id: string) =>
        localStateMgr.dispatch({
            type: 'ON_UPLOAD_START',
            video: {
                id,
                title,
                file: video,
                progress: 0,
            },
        });

    const onUploadProgress = (percentage: number, id: string) =>
        localStateMgr.dispatch({
            type: 'ON_UPLOAD_PROGRESS',
            videoID: id,
            percentage,
        });

    const onUploadSuccess = (id: string) => {
        refetch();
        localStateMgr.dispatch({
            type: 'ON_UPLOAD_SUCCESS',
            videoID: id,
        });
    };

    const onStartDownloading = (id?: string, video?: IQueuedUpload) =>
        localStateMgr.dispatch({
            type: 'ON_START_DOWNLOADING',
            videoID: id,
            video,
        });

    const toggleModal = (modalName: 'upload' | 'delete') =>
        dispatch({
            type: 'TOGGLE_MODAL',
            modalName,
        });

    const pressSelectedVideosAction = (
        buttonName: 'delete' | 'download' | 'cancel'
    ) => {
        switch (buttonName) {
            case 'delete': {
                return onDeleteVideo(true);
            }
            case 'download': {
                state.videos.forEach((video) => {
                    if (video.checked) {
                        onDownloadStart(video);
                    }
                });
                return onUncheckVideos();
            }
            case 'cancel': {
                return onUncheckVideos();
            }
        }
    };

    const isDownloading = (videoID: string) => {
        return localStateMgr.state.uploadsQueue[videoID]?.downloading;
    };

    const moveVideo = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            dispatch({
                type: 'CHANGE_VIDEO_INDEX',
                dragIndex,
                hoverIndex,
            });
        },
        [state.videos]
    );

    const [logoutOpened, setLogoutOpened] = useState(false);

    return (
        <>
            <Drawer
                classes={{ paper: classes.drawerPaper }}
                variant='permanent'
                open={true}
            >
                <div className={classes.toolbar}>
                    <div className={classes.toolbarTitle}>
                        <img
                            src={keyframeLogo}
                            className={classes.keyframeLogo}
                            alt='logo'
                            onClick={(e) => history.push('/')}
                        />
                        <div className={classes.user}>
                            <div
                                className={classes.userInfo}
                                onClick={() => setLogoutOpened((prev) => !prev)}
                            >
                                <Avatar
                                    src='https://trello-members.s3.amazonaws.com/5d794f790019fe2fe6babfb5/0d2f353e6726d5bc90ddd66ff175de79/original.png'
                                    className={classes.userAvatar}
                                    alt='avatar'
                                />
                                <Typography variant='caption'>
                                    Hi James C.
                                </Typography>
                                {logoutOpened ? (
                                    <ArrowDropUpIcon />
                                ) : (
                                    <ArrowDropDownIcon />
                                )}
                            </div>
                            <div
                                className={classes.logout}
                                style={{
                                    height: logoutOpened ? '60px' : '0px',
                                    overflow: logoutOpened
                                        ? 'visible'
                                        : 'hidden',
                                }}
                            >
                                <div onClick={(e) => history.push('/profile')}>
                                    Edit
                                </div>
                                <div onClick={(e) => history.push('/logout')}>
                                    Logout
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                {loading ? null : (
                    <DndProvider backend={HTML5Backend}>
                        {state.videos?.map((video: IVideo, index: number) => (
                            <Video
                                key={video.id}
                                index={index}
                                video={video}
                                downloading={isDownloading(video.id)}
                                moveVideo={moveVideo}
                                onCheckVideo={onCheckVideo}
                                onSelectVideo={onSelectVideo}
                                onDeleteVideo={onDeleteVideo}
                                onDownloadVideo={onDownloadStart}
                            />
                        ))}
                    </DndProvider>
                )}
                <UploadButton
                    onClick={() => {
                        sendUserEvent(
                            gameFootageUploadOpened,
                            window.location.href
                        );
                        toggleModal('upload');
                    }}
                />
            </Drawer>
            <VideoUploadDialog
                open={state.modals.upload.opened}
                closeModal={() => toggleModal('upload')}
                onUploadStart={onUploadStart}
                onUploadSuccess={onUploadSuccess}
                onUploadProgress={onUploadProgress}
            />
            <ModalDialog
                open={state.modals.delete.opened}
                title=''
                message={state.modals.delete.text}
                width={'300px'}
                confirmButtonText={'Delete'}
                onConfirm={() => deleteVideo(state.deletingVideoID)}
                onClose={() => toggleModal('delete')}
            />
            <DownloadDeleteButtons
                open={!!state.videos.filter((video) => video.checked).length}
                toDelete={state.videos.filter((video) => video.checked).length}
                toDownload={
                    state.videos.filter(
                        (video) => video.checked && !isDownloading(video.id)
                    ).length
                }
                onPress={pressSelectedVideosAction}
            />
        </>
    );
};

export const GameFootage = compose(
    withStyles(styles),
    withLocalState,
    withTelestrationState
)(gameFootage);
