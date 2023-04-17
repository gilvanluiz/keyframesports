import * as React from 'react';
import { TableRow, TableCell } from '@material-ui/core';

interface IFeedbackItemProps {
    feedback: {
        username: string;
        subject: string;
        message: string;
        created_at: string;
    };
}

export const FeedbackItem = ({
    feedback: { username, subject, message, created_at },
}: IFeedbackItemProps) => (
    <TableRow>
        <TableCell>{username}</TableCell>
        <TableCell>{subject}</TableCell>
        <TableCell>{message}</TableCell>
        <TableCell>{new Date(created_at).toLocaleString()}</TableCell>
    </TableRow>
);
