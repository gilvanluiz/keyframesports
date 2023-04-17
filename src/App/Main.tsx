import * as React from 'react';
import { CssBaseline } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'fp-ts/lib/function';
import { withStyles } from '@material-ui/core/styles';
import { withLocalState, ILocalStateMgr } from './LocalState';
import { Routes } from './Routes';
import { LeftSideMenu } from './Components/LeftSideMenu';
import { DownloadUploadFiles } from './Components/DownloadUploadFiles';
import { SwitchBrowserMessage } from './SwitchBrowser';
import { ValidateEmailMessage } from './ValidateEmail';
import { ValidatePhoneMessage } from './ValidatePhone';
import services from '../Api/services';
import BackgroundImage from '../Assets/keyframe_logo.png';
import { browserName } from 'react-device-detect';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

const GET_VIDEOS = ([field, direction]: ['created_at', 'desc']) => gql`
query MyVideos ($limit: Int, $offset: Int, $email: String!) {
    video (limit: $limit, offset: $offset, where: {user_creator_email: {_eq: $email}}, order_by: {${field}: ${direction}}) {
        created_at
        subtitle
        duration
        id
        s3_key
        title
    }
}
`;

interface IProps {
    classes: any;
    localStateMgr: ILocalStateMgr;
    location: any;
    history: any;
}

const drawerWidth = 240;

const styles = (theme: any) => ({
    root: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        height: '100vh',
    },
    grow: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#2d313b',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    gridItem: {
        width: '100%',
    },
    gridContainer: {
        padding: '0 20px',
    },
    content: {
        marginLeft: drawerWidth,
        display: 'flex',
        height: '100vh',
        transition: 'margin-left 0.5s ease-out',
        '&.maxWidth': {
            marginLeft: '72px',
        },
        '&::after': {
            content: '""',
            background: `url(${BackgroundImage}) no-repeat`,
            backgroundSize: '100vw 100vh',
            opacity: 0.03,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            zIndex: -1,
        },
    },
    inactive: {
        color: 'grey' as 'grey',
    },
    closeIcon: {
        '&:hover': {
            cursor: 'pointer',
            color: '#3f7fb5ab',
        },
    },
});

const Main = (props: IProps) => {
    const {
        classes,
        localStateMgr: { state, dispatch },
    } = props;
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const isSuported = browserName.indexOf('Chrome') !== -1 ? false : true;
    const { data: videoIds, loading, error } = useQuery(
        GET_VIDEOS(['created_at', 'desc']),
        {
            variables: {
                email: username,
            },
        }
    );
    const [subscriptionVerification, setSubscriptionVerification] = useState(
        true
    );
    const [dialogState, setDialogState] = useState(isSuported);

    const [emailVerified, setEmailVerified] = useState(true);
    const [phoneVerified, setPhoneVerified] = useState(true);
    const [phone, setPhone]: any = useState();

    useEffect(() => {
        if (!loading) {
            if (!error) {
                const mappedData: [string, string] = videoIds.video.map(
                    ({ id }: { id: string }) => {
                        return id.split('/').map(encodeURIComponent).join('/');
                    }
                );
                dispatch({ type: 'ON_VIDEOS_LOADED', payload: mappedData });
            } else {
                console.error('fetching videos error', error);
            }
        }
    }, [loading]);

    console.log('emailVerified', emailVerified);

    useEffect(() => {
        setSubscriptionVerification(true);
        services
            .login({
                username,
                password,
            })
            .then(({ data }: any) => {
                localStorage.setItem('userId', data['user-id']);
                const registerDate = new Date(
                    data.account['user-management.user/created-at']
                ).getTime();
                const _emailVerified = data['email-verified'];
                const _phoneVerified = data['phone-verified'];
                setPhone(data.phone);
                const now = Date.now();
                const diff = now - registerDate;
                // if user trial is ended and user doesn't have subscribe or affiliate - redirect to payment page
                if (!_emailVerified) {
                    console.log('email unverified');
                    setEmailVerified(false);
                }
                if (!_phoneVerified) {
                    console.log('phone unverified');
                    setPhoneVerified(false);
                }
                if (diff > 1000 * 60 * 60 * 24 * 7) {
                    // 7 days in ms
                    if (data.subscriptions.length === 0 && !data.affiliate) {
                        setSubscriptionVerification(false);
                    }
                }
            });
    }, []);

    useEffect(() => {
        if (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        ) {
            dispatch({ type: 'ON_TOUCH_DEVICE_DETECTED' });
        }
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <LeftSideMenu
                open={state.leftSideMenuOpen}
                onToggle={() => dispatch({ type: 'ON_TOGGLE_LEFT_SIDE_MENU' })}
            />
            <main
                className={`${classes.content} ${
                    state.leftSideMenuOpen || 'maxWidth'
                }`}
            >
                <Routes isUserSubscribed={subscriptionVerification} />
            </main>
            <DownloadUploadFiles />
            <SwitchBrowserMessage
                open={dialogState}
                onClose={() => setDialogState(false)}
            />
            <ValidateEmailMessage emailUnverified={!emailVerified} />
            <ValidatePhoneMessage
                phone={phone}
                setPhone={setPhone}
                phoneVerified={phoneVerified}
                setPhoneVerified={setPhoneVerified}
                display={emailVerified && !phoneVerified}
            />
        </div>
    );
};

const MainComponent = compose(
    withStyles(styles),
    withLocalState,
    withRouter
)(Main);

export default MainComponent;
