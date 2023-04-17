import * as React from 'react';
import { useEffect } from 'react';
import { flow } from 'fp-ts/lib/function';
import { withStyles, WithStyles as IWithStyles } from '@material-ui/core';
import { EditVideo } from './EditVideo';
import { initializeTM, withTelestrationState } from '../State';
import { ITelestrationStateMgr } from '../Types';
import { ILocalStateMgr, withLocalState } from 'src/App/LocalState';
import { s3KeyToUrl } from 'src/Utilities/AwsVideoLibrary';

interface IData {
    video: any;
}

interface IEditTelestrationProps extends IWithStyles {
    loading: any;
    data: IData;
    videoID: string;
    telestrationStateMgr: ITelestrationStateMgr;
    localStateMgr: ILocalStateMgr;
}

const styles = () => ({
    root: {
        display: 'flex',
        justifyContent: 'space-around',
    },
});

const editTelestration = ({
    data,
    videoID,
    telestrationStateMgr,
    localStateMgr,
    classes,
}: IEditTelestrationProps) => {
    const { state, dispatchAction } = telestrationStateMgr;

    let videoURL = null;
    let title = null;

    videoURL = s3KeyToUrl(data.video[0].s3_key).video_url;
    title = data.video[0].title;

    useEffect(() => {
        dispatchAction(initializeTM());
    }, []);

    return state.videoLoadError !== 'no-errors' ? (
        <div className={classes.message}>{state.videoLoadError}</div>
    ) : (
        <div
            style={{
                width: '100%',
                visibility: state.videoLoading ? 'hidden' : 'visible',
                // need for pointercancel not firing for touch devices
                touchAction: 'none',
            }}
        >
            <EditVideo
                videoUrl={videoURL}
                videoTitle={title}
                videoID={videoID}
            />
        </div>
    );
};

export const EditTelestration = flow(
    withTelestrationState,
    withLocalState,
    withStyles(styles)
)(editTelestration);
