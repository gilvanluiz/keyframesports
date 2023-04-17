import * as React from 'react';
import gql from 'graphql-tag';
import {
    Button,
    Box,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    withStyles,
    WithStyles as IWithStyles,
    Theme as ITheme,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { FeedbackItem } from './ListView/FeedbackItem';

const FEEDBACKS_QUERY = gql`
    query Feedbacks($limit: Int, $offset: Int) {
        keyframe_feedback_user_feedback(
            limit: $limit
            offset: $offset
            order_by: { created_at: desc }
        ) {
            id
            message
            subject
            username
            created_at
        }
    }
`;

const pagination = {
    limit: 5,
    offset: 0,
};

const styles = (theme: ITheme) => ({
    container: {
        height: '100%',
        width: '100%',
    },
    header: {
        display: 'flex',
        color: theme.palette.common.white,
        background: theme.palette.primary.dark,
        fontWeight: 'normal' as 'normal',
        textTransform: 'uppercase' as 'uppercase',
        padding: `${theme.spacing(1.25)}px ${theme.spacing(2.5)}px`,
    },
    title: {
        fontSize: '2.2em',
        display: 'flex',
        alignItems: 'center',
        minWidth: theme.spacing(30),
    },
    loadMoreButton: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        fontSize: theme.spacing(2),
        marginLeft: 'auto',
        borderRadius: theme.spacing(1),
        padding: `0px ${theme.spacing(2.5)}px`,
        minWidth: theme.spacing(25),
        fontWeight: 'bold' as 'bold',
    },
    table: {
        height: `calc(100vh - ${theme.spacing(8)}px)`,
        maxHeight: `calc(100vh - ${theme.spacing(8)}px)`,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
});

const feedbackList = ({ classes }: IWithStyles) => {
    const [feedbacks, setFeedbacks]: [any, any] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const { data, loading, error, fetchMore } = useQuery(FEEDBACKS_QUERY, {
        variables: {
            limit: pagination.limit,
            offset: pagination.offset,
        },
        pollInterval: 10000,
    });

    useEffect(() => {
        if (data) {
            // if data.keyframe_feedback_user_feedback.length === limit - it's new feedback from pollInternal
            // these feedbacks need to merge
            const userFeedback = data.keyframe_feedback_user_feedback;
            if (userFeedback && userFeedback.length === pagination.limit) {
                const newFeedbacks = userFeedback.filter((newFeedback: any) => {
                    return !feedbacks.find(
                        (feedback: any) => userFeedback.id === newFeedback.id
                    );
                });
                setFeedbacks([...newFeedbacks, ...feedbacks]);
            } else {
                setFeedbacks(userFeedback);
            }
        }
    }, [data]);

    const loadMore = () => {
        setButtonDisabled(true);
        fetchMore({
            variables: {
                offset: feedbacks.length,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                setButtonDisabled(
                    !fetchMoreResult.keyframe_feedback_user_feedback.length
                );
                return !fetchMoreResult
                    ? prev
                    : Object.assign({}, prev, {
                          keyframe_feedback_user_feedback: [
                              ...feedbacks,
                              ...fetchMoreResult.keyframe_feedback_user_feedback,
                          ],
                      });
            },
        });
    };

    return loading ? (
        <p>Loading...</p>
    ) : error ? (
        <p>Error</p>
    ) : (
        <Box className={classes.container}>
            <Box className={classes.header}>
                <Box className={classes.title}>Feedbacks</Box>
                <Button
                    aria-label='Load More'
                    onClick={loadMore}
                    disabled={buttonDisabled}
                    className={classes.loadMoreButton}
                >
                    Load More
                </Button>
            </Box>
            <Box className={classes.table}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Submitted</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedbacks.map((feedback: any, index: number) => (
                            <FeedbackItem key={index} feedback={feedback} />
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export const FeedbackListView = withStyles(styles)(feedbackList);
