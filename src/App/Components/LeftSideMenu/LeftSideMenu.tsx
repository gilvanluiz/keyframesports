import * as React from 'react';
import {
    Box,
    Drawer,
    Divider,
    List,
    withStyles,
    WithStyles as IWithStyles,
    Button,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem } from './Components/MenuItem';
import { MenuTutorialButton } from './Components/MenuTutorialButton';
import { ILink, IProps } from './types';
import KeyframeLogoIcon from '../../../Assets/keyframe_logo.png';
import GameFootageIcon from '../../../Assets/game_footage.png';
import ContactUsIcon from '../../../Assets/contact_us.png';
import LogoutIcon from '../../../Assets/logout.png';
import FeedbackIcon from '../../../Assets/feedback.png';
import RewindLeftIcon from '../../../Assets/rewind_left.png';
import RewindRightIcon from '../../../Assets/rewind_right.png';
import { useLocation } from 'react-router';
import TutorialIcon from './Assests/Tutorial_icon.png';
import { useHistory } from 'react-router';
import { styles } from './LeftSideMenuStyles';

const adminEmails = [
    'tmcothran@gmail.com',
    'gary@ventre.tech',
    'james@keyframesports.com',
];

const adminNavLinks = [
    {
        title: 'Feedback',
        url: '/feedback',
        icon: <img width='24' height='24' src={FeedbackIcon} alt='feedback' />,
        inactive: false,
    },
    {
        title: 'Pro',
        url: '/mode/pro/game-footage/',
        icon: (
            <img
                width='24'
                height='24'
                src={GameFootageIcon}
                alt='game footage'
            />
        ),
        inactive: false,
    },
];

const topNavLinks = [
    {
        title: 'Game Footage',
        url: '/video-library/',
        icon: (
            <img
                width='24'
                height='24'
                src={GameFootageIcon}
                alt='game footage'
            />
        ),
        inactive: false,
    },
];

const bottomNavLinks = [
    {
        title: 'Contact Us',
        url: '/report-problem',
        icon: (
            <img width='24' height='24' src={ContactUsIcon} alt='contact us' />
        ),
        inactive: false,
    },
    {
        title: 'Tutorial',
        url:
            'https://www.youtube.com/watch?v=RIlyi4bd4NI&list=PLPj2DJXh7jQ5xCxGWYd65BewBbJjKjbx9&index=1',
        icon: <img width='24' height='20' src={TutorialIcon} alt='tutorial' />,
        inactive: true,
    },
    {
        title: 'Logout',
        url: '/logout',
        icon: <img width='24' height='24' src={LogoutIcon} alt='logout' />,
        inactive: false,
    },
];

const leftSideMenu = ({ classes, onToggle, open }: IProps & IWithStyles) => {
    const [navLinks, setNavLinks] = useState<ILink[]>([]);
    const location = useLocation();
    const history = useHistory();

    const toMenuItem = (link: ILink, index: number) => {
        if (link.title === 'Tutorial') {
            return <MenuTutorialButton key={index} link={link} />;
        }
        return (
            <MenuItem
                key={index}
                active={!location.pathname.includes(link.url)}
                link={link}
            />
        );
    };

    useEffect(() => {
        const username = localStorage.getItem('username') as string;
        setNavLinks(
            topNavLinks.concat(
                adminEmails.includes(username) ? adminNavLinks : [],
                bottomNavLinks
            )
        );
    }, []);
    return (
        <Drawer
            className={classes.drawer}
            open={
                location.pathname !== '/mode/pro/game-footage/' ||
                !location.pathname.startsWith('/mode/pro/telestrations')
            }
            variant='permanent'
            classes={{
                paper: `${classes.drawerPaper} ${open || 'closed'}`,
            }}
        >
            <Box className={classes.toolbar}>
                <Link to='/' className={classes.toolbarTitle}>
                    <img
                        className={classes.keyframeLogo}
                        src={KeyframeLogoIcon}
                        alt='logo'
                    />
                </Link>
            </Box>
            <Divider />
            <Box>
                <List className={classes.navLinks}>
                    {navLinks.map(toMenuItem)}
                </List>
            </Box>
            <Box className={classes.licenceButtonContainer}>
                <Button
                    className={classes.licenceButton}
                    classes={{ label: classes.licenceButtonText }}
                    onClick={() => history.push('/payments/make-payment')}
                >
                    {'Buy'}
                    <span
                        className={classes.transitionText}
                        style={{ display: open ? 'inline' : 'none' }}
                    >
                        a licence
                    </span>
                </Button>
            </Box>
            <Box className={classes.hideMenu}>
                <img
                    className='icon'
                    onClick={onToggle}
                    src={open ? RewindLeftIcon : RewindRightIcon}
                    alt='hide menu'
                />
            </Box>
        </Drawer>
    );
};

export const LeftSideMenu = withStyles(styles)(leftSideMenu);
