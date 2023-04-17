import * as React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import ShareIcon from '@material-ui/icons/Share';
import {
    Card,
    CardHeader,
    CardActions,
    IconButton,
    Avatar,
    CardMedia,
    CardContent,
    Typography,
    withStyles,
} from '@material-ui/core';

const styles = () => ({
    card: {
        maxWidth: 345,
        marginTop: 20,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: 'red',
    },
});

interface IProps {
    title: string;
    imageSrc: string;
    clipCount: number;
    createdAt: Date;
    classes: any;
    openShareDialog: () => any;
}

const playlistDetailCard = ({
    title,
    clipCount,
    createdAt,
    classes,
    imageSrc,
    openShareDialog,
}: IProps) => {
    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar aria-label='recipe' className={classes.avatar}>
                        {clipCount}
                    </Avatar>
                }
                action={
                    <IconButton aria-label='settings'>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={title}
                subheader={createdAt.toDateString()}
            />
            <CardMedia
                className={classes.media}
                image={imageSrc}
                title={`${clipCount} videos`}
            />
            <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Curabitur semper nulla a augue efficitur pharetra. Proin
                    quis nisi quis justo tincidunt viverra.
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton aria-label='add to favorites'>
                    <PlayCircleFilledIcon />
                </IconButton>
                <IconButton onClick={openShareDialog} aria-label='share'>
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export const PlaylistDetailCard = withStyles(styles)(playlistDetailCard);
