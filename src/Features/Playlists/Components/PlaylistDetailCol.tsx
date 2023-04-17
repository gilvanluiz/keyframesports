import * as React from 'react';
import {
    Card,
    CardMedia,
    CardActionArea,
    CardContent,
    Typography,
} from '@material-ui/core';

import fieldImg from '../../../Assets/field.jpg';

export const DetailCol = () => {
    return (
        <div>
            <Card>
                <CardActionArea>
                    <CardMedia
                        component='img'
                        image={fieldImg}
                        title='Soccer playlist'
                    />
                    <CardContent>
                        <Typography gutterBottom variant='h5' component='h2'>
                            Default
                        </Typography>
                        <Typography component='p'>
                            The default playlist for your telestrations.
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
};
