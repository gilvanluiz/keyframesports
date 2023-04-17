import * as React from 'react';
import clsx from 'clsx';
import { useState } from 'react';
import {
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { path } from 'ramda';
import { CheckCircle as CheckIcon } from '@material-ui/icons';

const styles = (theme: ITheme) => ({
    dropzone: {
        borderRadius: theme.spacing(0.5),
        border: '2px dashed rgba(255, 255, 255, 0.12)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
    },
    text: {
        color: 'rgba(255, 255, 255, 0.12)',
        cursor: 'pointer',
    },
    completeIcon: {
        height: '3rem',
        width: 'auto',
    },
    dragActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    hiddenInput: {
        display: 'none',
    },
});

interface IProps extends IWithStyles {
    onFileAttach: (files: File[]) => void;
    className?: string;
    hasFiles: boolean;
    text: string;
}

const dropzone = ({
    classes,
    className,
    onFileAttach,
    hasFiles,
    text,
}: IProps) => {
    const [dragActive, setDragActive] = useState(false);
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

    const centerText = hasFiles ? (
        <p className={classes.iconContainer}>
            <CheckIcon className={classes.completeIcon} />
        </p>
    ) : (
        <p className={classes.text}>{text}</p>
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
            className={clsx(
                classes.dropzone,
                dragActive && classes.dragActive,
                className
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={openFileSelection}
        >
            <input
                className={classes.hiddenInput}
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

export const Dropzone = withStyles(styles)(dropzone);
