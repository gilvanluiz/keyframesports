import * as React from 'react';
import clsx from 'clsx';
import {
    Divider,
    Slide,
    Fade,
    withStyles,
    WithStyles as IWithStyles,
    Typography,
} from '@material-ui/core';
import {
    useDrag,
    useDrop,
    DropTargetMonitor as IDropTargetMonitor,
} from 'react-dnd';
import { useRef, useState } from 'react';
import { XYCoord } from 'dnd-core';
import { Mask } from './Mask';
import { StyledCheckbox } from './Checkbox';
import { VideoTool } from './VideoTool';
import { RoundIcon } from './RoundIcon';
import { IVideo } from '../types';
import { formatTime } from '../../../Utilities/Time';
import { styles } from './styles/VideoStyle';
import { s3KeyToUrl } from 'src/Utilities/Aws';
import { Transition } from './Transition';

interface IProps extends IWithStyles {
    index: number;
    video: IVideo;
    downloading?: boolean;
    moveVideo: (dragIndex: number, hoverIndex: number) => void;
    onCheckVideo: (id: string) => void;
    onSelectVideo: (id: string) => void;
    onDeleteVideo: (multiply: boolean, title?: string, id?: string) => void;
    onDownloadVideo: (video: IVideo) => void;
}

interface IDragItem {
    index: number;
    id: string;
    type: string;
}

const _video = ({
    index,
    video,
    downloading,
    moveVideo,
    onCheckVideo,
    onSelectVideo,
    onDeleteVideo,
    onDownloadVideo,
    classes,
}: IProps) => {
    const [needExtraClass, setNeedExtraClass] = useState(false);
    const { video_url } = s3KeyToUrl(video.s3_key);
    const onCheck = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        onCheckVideo(video.id);
    };

    const onSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        onSelectVideo(video.id);
    };

    const onDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        onDeleteVideo(false, video.title, video.id);
    };

    const onDownload = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        onDownloadVideo(video);
    };

    const videoRef = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: 'video',
        hover(item: IDragItem, monitor: IDropTargetMonitor) {
            if (!videoRef.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = videoRef.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY =
                (clientOffset as XYCoord).y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveVideo(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        item: { type: 'video', id: video.id, index },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;

    drag(drop(videoRef));

    return (
        <Slide
            ref={videoRef}
            style={{ opacity }}
            direction='right'
            in={!video.deleted}
            timeout={500}
            mountOnEnter
            unmountOnExit
        >
            <div
                className={clsx(
                    classes.container,
                    needExtraClass && classes.videoSelected
                )}
            >
                <div className={classes.flex}>
                    <div className={classes.video} onClick={onSelect}>
                        <div className={classes.videoInfo}>
                            <Typography
                                variant='caption'
                                className={classes.videoTitle}
                            >
                                {video.title}
                            </Typography>
                            <Typography variant='caption'>
                                {formatTime(video.duration || 900)}
                            </Typography>
                            <div className={classes.videoActions}>
                                <StyledCheckbox
                                    checked={!!video.checked}
                                    onClick={onCheck}
                                    inputProps={{
                                        'aria-label': 'check/uncheck video',
                                    }}
                                />
                                <Fade in={needExtraClass} timeout={500}>
                                    <div
                                        className={classes.videoDeleteDownload}
                                    >
                                        <RoundIcon
                                            disabled={downloading}
                                            iconName='downward'
                                            isButton={true}
                                            onClick={onDownload}
                                        />
                                        <RoundIcon
                                            iconName='delete'
                                            isButton={true}
                                            onClick={onDelete}
                                        />
                                    </div>
                                </Fade>
                            </div>
                        </div>
                        <div className={classes.videoThumbnailContainer}>
                            <video
                                crossOrigin='anonymous'
                                preload='metadata'
                                controls={false}
                                muted
                                width='100%'
                            >
                                <source
                                    src={video_url + '#t=0.5'}
                                    type='video/mp4'
                                />
                            </video>
                        </div>
                    </div>
                    <div
                        className={clsx(
                            classes.videoIndicators,
                            classes.flex,
                            classes.column,
                            classes.center
                        )}
                    >
                        {false ? <div className={classes.indicator} /> : null}
                        {video.downloaded ? (
                            <div className={classes.indicator} />
                        ) : null}
                    </div>
                </div>
                <Transition
                    animation='collapse'
                    onMount={() => setNeedExtraClass(true)}
                    onUnmount={() => setNeedExtraClass(false)}
                    video={video}
                >
                    <div className={classes.videoTools}>
                        <Divider />
                        <Mask video={video.id} />
                        <Divider />
                        <VideoTool />
                    </div>
                </Transition>
            </div>
        </Slide>
    );
};

export const Video = withStyles(styles)(_video);
