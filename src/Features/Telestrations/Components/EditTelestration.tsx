import * as React from 'react';
import { compose } from 'fp-ts/lib/function';
import { withStyles, WithStyles as IWithStyles } from '@material-ui/core';
import { EditVideo } from './EditVideo';
// import { s3KeyToUrl } from '../../../Utilities/Aws';
import { withTelestrationState } from '../State';
import { ITelestrationStateMgr } from '../Types';

import coach_paint_example from '../../../Assets/Videos/coach_paint_example.mp4';

const styles = () => ({
    root: {
        display: 'flex',
        justifyContent: 'space-around',
    },
});

interface IData {
    video: any;
}

interface IEditTelestrationProps extends IWithStyles {
    loading: any;
    data: IData;
    videoID: string;
    telestrationStateMgr: ITelestrationStateMgr;
}

const editTelestration = ({
    data,
    loading,
    videoID,
    telestrationStateMgr,
    classes,
}: IEditTelestrationProps) => {
    const { state } = telestrationStateMgr;
    // let videoURL = null;
    let title = null;

    // videoURL = s3KeyToUrl(data.video[0].s3_key).video_url;
    title = data.video[0].title;

    return state.videoLoadError !== 'no-errors' ? (
        <div className={classes.message}>{state.videoLoadError}</div>
    ) : (
        <div
            style={{
                width: '100%',
                visibility:
                    state.videoLoading || loading ? 'hidden' : 'visible',
            }}
        >
            <EditVideo
                // video_url={videoURL}
                videoUrl={coach_paint_example}
                videoTitle={title}
                videoID={videoID}
            />
        </div>
    );
};

export const EditTelestration = compose(
    withTelestrationState,
    withStyles(styles)
)(editTelestration);
