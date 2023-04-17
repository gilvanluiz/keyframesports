import * as React from 'react';
import { IPlaylistStateManager, IClip } from '../State';

interface IProps {
    stateManager: IPlaylistStateManager;
    clips: IClip[];
}
export const VideoPlayer = ({
    stateManager: { playlistState },
    clips,
}: IProps) => {
    const selectedClip: IClip = playlistState.selectedClip || clips[0];
    if (selectedClip) {
        const url = process.env.REACT_APP_S3_URI + selectedClip.s3_key;
        return (
            <div style={{ paddingBottom: 20 }}>
                <video controls src={url} style={{ width: '100%' }} />
            </div>
        );
    }
    return null;
};
