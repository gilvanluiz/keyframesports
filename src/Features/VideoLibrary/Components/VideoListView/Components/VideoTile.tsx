import * as React from 'react';
import {
    Divider,
    Button,
    IconButton,
    Box,
    withStyles,
    WithStyles as IWithStyles,
} from '@material-ui/core';
import { useRef, useState } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { compose } from 'fp-ts/lib/function';
import { useHistory } from 'react-router-dom';
import { Skeleton } from '@material-ui/lab';
import { XYCoord } from 'dnd-core';
import { withLocalState, ILocalStateMgr } from '../../../../../App/LocalState';
import { ItemTypes } from '../types';
import { formatTime } from '../../../../../Utilities/Time';
import { s3KeyToUrlImage } from '../../../../../Utilities/AwsVideoLibrary';
import { IClip } from '../../../../../Assets/videoVideoLibrary';
import DurationIcon from '../../../../../Assets/duration.png';
import EditIcon from '../../../../../Assets/edit.png';
import DeleteIcon from '../../../../../Assets/delete.png';
import TelestrateIcon from '../../../../../Assets/telestrate.png';
import {
    gameFootageClickedTelestrate,
    gameFootageWatchOnHover,
} from 'src/App/UserEvents';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { VideoTileStyles } from './VideoTileStyles';
import { DeviceOrientationAlert } from '../../DeviceOrientationAlert';
interface IProps extends IWithStyles {
    clip: IClip;
    index: number;
    localStateMgr: ILocalStateMgr;
    videos: IClip[];
    rootDispatch: React.Dispatch<any>;
    openModal: (
        modalName: 'editVideoModal' | 'deleteVideoModal',
        clip: IClip
    ) => (e: React.MouseEvent) => void;
}

interface IDragItem {
    index: number;
    id: string;
    type: string;
}

const swapVideos = (videos: IClip[], hoverIndex: number, dragIndex: number) => {
    [videos[hoverIndex], videos[dragIndex]] = [
        videos[dragIndex],
        videos[hoverIndex],
    ];
    return Array.from(videos);
};
const videoTile = ({
    index,
    clip,
    classes,
    openModal,
    localStateMgr,
    rootDispatch,
    videos,
}: IProps) => {
    const [
        deviceOrientationAlertOpen,
        setDeviceOrientationAlertOpen,
    ] = useState(false);

    const history = useHistory();
    const ref = useRef<HTMLDivElement>(null);
    const { state, dispatch } = localStateMgr;
    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop(item: IDragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            rootDispatch({
                type: 'ON_DRAG_VIDEO',
                payload: swapVideos(videos, hoverIndex, dragIndex),
            });
        },
    });

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id: clip.id, index },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    const videoRef = React.createRef<HTMLVideoElement>();

    const playVideo = () => {
        sendUserEvent(gameFootageWatchOnHover, window.location.href, clip.id);
        if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play();
        }
    };

    const pauseVideo = () => {
        if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const { image_url } = s3KeyToUrlImage(clip.s3_key);
    console.log(image_url);
    const [loading, setLoading] = useState(true);

    const loadingClass = loading ? 'loading' : '';

    return (
        <div ref={ref} style={{ opacity }} className={classes.container}>
            <Box className={classes.tile}>
                {/* tslint:disable-next-line */}
                <Box
                    className={`${classes.thumbnail} ${
                        !state.leftSideMenuOpen ? 'extended' : ''
                    }`}
                >
                    <Skeleton variant='rect' className={loadingClass} />
                    <Box
                        className={loadingClass}
                        onClick={() => {
                            if (state.isTouchDevice) {
                                if (window.innerHeight > window.innerWidth) {
                                    return setDeviceOrientationAlertOpen(true);
                                }
                            }
                            sendUserEvent(
                                gameFootageClickedTelestrate,
                                window.location.href,
                                clip.id
                            );
                            history.push(`/telestrations/${clip.id}`);
                            dispatch({ type: 'ON_TOGGLE_TELESTRATION' });
                        }}
                        onMouseOver={playVideo}
                        onMouseLeave={pauseVideo}
                    >
                        <img
                            src={image_url}
                            width='100%'
                            height='100%'
                            alt=''
                            onLoad={() => setLoading(false)}
                            onError={(event: any) => {
                                const { target } = event;
                                const message = (target as HTMLVideoElement)
                                    .error?.message;
                                const errorCode = (target as HTMLVideoElement)
                                    .error?.code;
                                if (message) {
                                    console.error(
                                        `${message}. MediaError code ${errorCode}`
                                    );
                                } else {
                                    console.error(
                                        `Video error. MediaError code ${errorCode}`
                                    );
                                }
                            }}
                        />
                    </Box>
                </Box>
                <Box className={classes.info}>
                    <Box className={classes.duration}>
                        <img
                            src={DurationIcon}
                            alt='video duration'
                            width='24'
                            height='24'
                        />
                        <Box component='span'>
                            {clip.duration ? formatTime(clip.duration) : null}
                        </Box>
                        {clip.recent ? (
                            <Box className={classes.recent}>
                                Recent Uploaded
                            </Box>
                        ) : null}
                    </Box>

                    {/* TODO update when it changes. Записывать в стейт видео*/}

                    <Box className={classes.title}>{clip.title}</Box>
                    <Box className={classes.subtitle}>{clip.subtitle}</Box>
                </Box>
                <Divider />
                <Box className={classes.actions}>
                    <IconButton
                        className={classes.action}
                        onClick={openModal('editVideoModal', clip)}
                    >
                        <img
                            src={EditIcon}
                            alt='edit video'
                            width='24'
                            height='24'
                        />
                    </IconButton>
                    <IconButton
                        className={classes.action}
                        onClick={openModal('deleteVideoModal', clip)}
                    >
                        <img
                            src={DeleteIcon}
                            alt='delete video'
                            width='24'
                            height='24'
                        />
                    </IconButton>
                    <Button
                        className={classes.telestrate}
                        onClick={() => {
                            if (state.isTouchDevice) {
                                if (window.innerHeight > window.innerWidth) {
                                    return setDeviceOrientationAlertOpen(true);
                                }
                            }
                            sendUserEvent(
                                gameFootageClickedTelestrate,
                                window.location.href,
                                clip.id
                            );
                            history.push(`/telestrations/${clip.id}`);
                            dispatch({ type: 'ON_TOGGLE_TELESTRATION' });
                        }}
                        startIcon={
                            <img
                                src={TelestrateIcon}
                                alt='telestrate video'
                                width='24'
                                height='24'
                            />
                        }
                    >
                        Telestrate
                    </Button>
                </Box>
            </Box>
            <DeviceOrientationAlert
                open={deviceOrientationAlertOpen}
                onClose={setDeviceOrientationAlertOpen}
            />
        </div>
    );
};

export const VideoTile = compose(
    withStyles(VideoTileStyles),
    withLocalState
)(videoTile);
