import * as React from 'react';
import {
    Typography,
    ListItem,
    ListItemIcon,
    ListItemText,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ILink } from '../types';

const styles = (theme: ITheme) => ({
    navLink: {
        '&.active': {
            background: theme.palette.primary.main,
            borderRadius: theme.spacing(1),
        },
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
    active: boolean;
}

export const MenuItem = React.memo(
    withStyles(styles)(({ classes, active, link }: IProps) => {
        const customLink = React.forwardRef<HTMLLinkElement, any>(
            (props, ref) => <Link ref={ref} to={link.url} {...props} />
        );
        const titleElement = (
            <Typography className={classes.navLinkTextElement}>
                {link.title}
            </Typography>
        );

        return (
            <ListItem
                component={customLink}
                className={`${classes.navLink} ${active || 'active'}`}
            >
                <ListItemIcon className={classes.navLinkIcon}>
                    {link.icon}
                </ListItemIcon>
                <ListItemText
                    disableTypography
                    primary={titleElement}
                    className={classes.navLinkText}
                />
            </ListItem>
        );
    })
);
