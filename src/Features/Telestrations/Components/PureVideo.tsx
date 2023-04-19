import * as React from 'react';
interface IPureVideoProps {
    handleVideoLoad: () => void;
    videoRef: React.RefObject<HTMLVideoElement>;
    src: string;
    onError: (message: string) => void;
    videoTickListener: (time: number) => void;
    className: string;
}

interface IPureVideoState {
    error: boolean;
}

export class PureVideo extends React.Component<
    IPureVideoProps,
    IPureVideoState
> {
    public shouldComponentUpdate() {
        return false;
    }
    public onTick(e: Event): void {
        const { videoRef, videoTickListener } = this.props;
        const { current: video } = videoRef;
        if (video) {
            videoTickListener(video.currentTime);
        } else {
            console.error('video ref loose');
        }

        // const { duration, currentTime } = video;
        // const percentFinished = (currentTime / duration) * 100;
        // return setProgressState(percentFinished);
    }

    public componentDidMount(): void {
        const { videoRef } = this.props;
        const { current: video } = videoRef;
        if (video) {
            video.addEventListener('timeupdate', this.onTick.bind(this));
        }
    }

    public componentWillUnmount(): void {
        const { videoRef } = this.props;
        const { current: video } = videoRef;
        if (video) {
            video.removeEventListener('timeupdate', this.onTick.bind(this));
        }
    }

    public render() {
        const { videoRef, src, handleVideoLoad } = this.props;

        if (!videoRef) {
            throw Error('No video reference');
        }

        return (
            <video
                muted
                crossOrigin='anonymous'
                ref={videoRef}
                onError={(event) => {
                    const { target } = event;
                    const message = (target as HTMLVideoElement).error?.message;
                    if (message) {
                        this.props.onError(message);
                    }
                }}
                className={this.props.className}
                onLoadedData={handleVideoLoad}
            >
                <source src={src} type='video/mp4' />
            </video>
        );
    }
}
