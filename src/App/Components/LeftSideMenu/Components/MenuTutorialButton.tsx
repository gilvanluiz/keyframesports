import * as React from 'react';
import {
    Typography,
    ListItem,
    ListItemIcon,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
    Link,
} from '@material-ui/core';
import { ILink } from '../types';
import { sendUserEvent } from 'src/App/UserEvents/UserEventManager';
import { telestrationHelpClicked } from 'src/App/UserEvents';

const styles = (theme: ITheme) => ({
    navLink: {
        cursor: 'pointer',
    },
    navLinkTextElement: {
        color: theme.palette.common.white,
        textTransform: 'uppercase' as 'uppercase',
        fontWeight: 'bold' as 'bold',
    },
    navLinkText: {
        overflow: 'hidden',
        whiteSpace: 'nowrap' as 'nowrap',
    },
    navLinkIcon: {
        color: 'grey',
    },
});

interface IProps extends IWithStyles {
    link: ILink;
}

export const MenuTutorialButton = React.memo(
    withStyles(styles)(({ classes, link }: IProps) => {
        function handleClick() {
            if (window.location.pathname.includes('telestration')) {
                const videoId = window.location.pathname.split('/').pop();
                sendUserEvent(
                    telestrationHelpClicked,
                    window.location.href,
                    videoId
                );
            }
        }

        return (
            <Link
                underline='none'
                href={link.url}
                target='_blank'
                onClick={() => handleClick()}
            >
                <ListItem className={classes.navLink}>
                    <ListItemIcon className={classes.navLinkIcon}>
                        {link.icon}
                    </ListItemIcon>
                    <Typography className={classes.navLinkTextElement}>
                        {link.title}
                    </Typography>
                </ListItem>
            </Link>
        );
    })
);
