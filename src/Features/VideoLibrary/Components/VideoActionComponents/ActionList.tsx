import * as React from 'react';
import { MenuItem } from '@material-ui/core';
import { compose } from 'fp-ts/lib/function';
import { Lens } from 'monocle-ts';
import {
    IVideoLibraryStateMgr,
    withVideoLibraryState,
    IVideoLibraryState,
} from '../../State';
import { ILocalStateMgr, withLocalState } from '../../../../App/LocalState';
import { IAction } from './types';
import { withNavigation } from '../../../../App/withNavigation';

interface IProps {
    localStateMgr: ILocalStateMgr;
    videoLibraryStateMgr: IVideoLibraryStateMgr;
    video: any;
    history: any;
}

const openEditVideoModal = ({
    videoLibraryState,
    setVideoLibraryState,
}: IVideoLibraryStateMgr) => (e: React.MouseEvent) => {
    e.preventDefault();
    const newState = Lens.fromPath<IVideoLibraryState>()([
        'modalsOpened',
        'editVideoModal',
    ]).set(true)(videoLibraryState);
    setVideoLibraryState(newState);
};

const openDeleteVideoModal = ({
    videoLibraryState,
    setVideoLibraryState,
}: IVideoLibraryStateMgr) => (e: React.MouseEvent) => {
    e.preventDefault();
    const newState = Lens.fromPath<IVideoLibraryState>()([
        'modalsOpened',
        'deleteVideoModal',
    ]).set(true)(videoLibraryState);

    setVideoLibraryState(newState);
};

const actionListItems = ({
    localStateMgr,
    videoLibraryStateMgr,
    history: { push },
}: IProps) => {
    const { videoLibraryState } = videoLibraryStateMgr;
    const actions: IAction[] = [
        {
            text: 'Telestrate',
            onClick: (_: React.MouseEvent) =>
                push(`/telestrations/${videoLibraryState.selectedVideo.id}`),
        },
        {
            text: 'Edit',
            onClick: openEditVideoModal(videoLibraryStateMgr),
        },
        {
            text: 'Delete',
            onClick: openDeleteVideoModal(videoLibraryStateMgr),
        },
    ];

    return (
        <>
            {actions.map(({ text, onClick }: IAction, index: number) => (
                <MenuItem key={index} onClick={onClick}>
                    {text}
                </MenuItem>
            ))}
        </>
    );
};

export const ActionList = compose(
    withLocalState,
    withVideoLibraryState,
    withNavigation
)(actionListItems);
