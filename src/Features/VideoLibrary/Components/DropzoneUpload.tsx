import * as React from 'react';
import { useState } from 'react';
import { withStyles } from '@material-ui/core';
import { compose } from 'fp-ts/lib/function';
import { path } from 'ramda';
import { CheckCircle as CheckIcon } from '@material-ui/icons';
import { withLocalState, ILocalStateMgr } from '../../../App/LocalState';

const styles = () => ({
    dropzone: {
        textAlign: 'center' as 'center',
        padding: '5px',
        backgroundColor: '#E1E1E1',
        borderRadius: '5px',
        minHeight: '60px',
        border: '2px dashed #C7C7C7',
        height: '400px',
        width: '580px',
        position: 'relative' as 'relative',
        cursor: 'pointer' as 'pointer',
    },
    text: {
        position: 'absolute' as 'absolute',
        margin: 'auto',
        top: '48%',
        left: '39%',
        cursor: 'pointer' as 'pointer',
        color: 'black',
        fontSize: '1rem',
        fontWeight: 500,
    },
    iconContainer: {
        position: 'absolute' as 'absolute',
        top: '42%',
        left: '47%',
    },
    completeIcon: {
        height: '3rem',
        width: 'auto' as 'auto',
    },
    dragActive: {
        backgroundColor: 'grey',
    },
});

interface IProps {
    classes: any;
    onFileAttach: (files: File[]) => void;
    showScreenshot: boolean;
    localStateMgr: ILocalStateMgr;
}

const dropzone = ({
    classes,
    onFileAttach,
    showScreenshot,
    localStateMgr: { state: localState },
}: IProps) => {
    const [dragActive, setDragActive] = useState(false);
    const dragActiveClass = dragActive ? classes.dragActive : '';
    const hiddenInputRef = React.createRef<HTMLInputElement>();
    const openFileSelection = () => {
        if (hiddenInputRef?.current) {
            hiddenInputRef.current.files = null;
            hiddenInputRef.current.value = '';
            hiddenInputRef.current.click();
            return true;
        }
        return false;
    };
    const onFileChange = async () => {
        const videoFiles = Object.values(
            path(['current', 'files'], hiddenInputRef) as File[]
        );
        onFileAttach(videoFiles);
    };
    const centerText = showScreenshot ? (
        <p className={classes.iconContainer}>
            <CheckIcon className={classes.completeIcon} />
        </p>
    ) : (
        <p className={classes.text}>Drop video here</p>
    );

    const handleDrop = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        const {
            dataTransfer: { files },
        } = event;
        const videoFiles = Object.values(files) as File[];
        onFileAttach(videoFiles);
    };

    const handleDragOver = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };

    return (
        <div
            className={`${classes.dropzone} ${dragActiveClass}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={openFileSelection}
        >
            <input
                style={{ display: 'none' }}
                ref={hiddenInputRef}
                type='file'
                accept='video/*'
                multiple={true}
                onChange={onFileChange}
            />
            {centerText}
        </div>
    );
};

export const Dropzone = compose(withLocalState, withStyles(styles))(dropzone);
