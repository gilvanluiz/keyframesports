import * as AWS from 'aws-sdk';
import * as t from 'io-ts';
import gql from 'graphql-tag';
import axios from 'axios';
import { pipe, path, assoc } from 'ramda';
import { right, left } from 'fp-ts/lib/Either';
import { print } from 'graphql';
import { getAuthHeader } from '../App/apolloClient';

const getCheckConversionQuery = (type: string) => gql`
    query Conversion ($s3Key: String) {
        ${type}_conversions_in_flight(where: {input_s3_key: {_eq: $s3Key}}) {
            aws_id
            created_at
            input_s3_key
            last_check_at
            output_s3_key
            status
            ${type}_id
            user_email
        }
    }
`;

export interface IUploadVideo {
    videoFile: File;
    videoType?: 'game-footage' | 'telestration';
    id: string;
    title: string;
    subtitle: string;
    duration?: number;
    type: 'telestration' | 'footage';
    onSuccess: () => any;
    onStartConversion?: () => any;
    onStartDownload?: () => any;
    onProgress: (percentage: number) => any;
}

const alephURI = process.env.REACT_APP_ALEPH_URI;

interface IServerNotificationOpts {
    s3Key: string;
    videoType?: 'game-footage' | 'telestration';
}

export const _notifyServerOfS3Upload = async (
    opts: IUploadVideo & IServerNotificationOpts
) => {
    const videoType = opts.videoType || 'game-footage';
    const username = localStorage.getItem('username');
    const pw = localStorage.getItem('password');
    const _opts = pipe(
        assoc('user_creator_email', username),
        assoc('username', username),
        assoc('password', pw),
        assoc('video_type', videoType),
        assoc('size', opts.videoFile.size)
    )(opts);

    const url =
        videoType !== 'telestration'
            ? alephURI + '/api-v1/upload-video/notify-footage-upload'
            : alephURI + '/api-v1/upload-video/notify-telestration-upload';

    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(_opts),
    });

    return result;
};

export const _beamToS3 = async ({ videoFile, onProgress }: IUploadVideo) => {
    // Get signed s3 link with form parameters
    const signedS3Opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: localStorage.getItem('username'),
            password: localStorage.getItem('password'),
            'content-type': 'video/mp4',
        }),
    };

    const s3SecureLinkRes = await fetch(
        process.env.REACT_APP_ALEPH_URI +
        '/api-v1/upload-video/signed-upload-link',
        signedS3Opts
    );

    const s3SecureLinkOpts = await s3SecureLinkRes.json();
    const baseUrl = s3SecureLinkOpts['base-url'];
    const formData = s3SecureLinkOpts['form-data'];
    const formDataObj = new FormData();
    // tslint:disable

    for (var k in formData) {
        formDataObj.append(k, formData[k]);
    }

    formDataObj.append('file', videoFile);
    // tslint:disable
    await axios.post(baseUrl, formDataObj, {
        onUploadProgress: (x) => {
            const percent = (x.loaded / x.total) * 100;
            onProgress(percent);
        },
    });
    return s3SecureLinkOpts;
};

const checkConversationStatus = async (
    s3Key: string,
    name: string,
    onSuccess: any,
    onStartDownload: any,
    type: string
) => {
    const authHeader = getAuthHeader();
    const { data } = await axios({
        url: process.env.REACT_APP_HASURA_URI,
        method: 'post',
        headers: {
            // 'X-Hasura-Admin-Secret': process.env.REACT_APP_HASURA_ADMIN_SECRET,
            // 'X-Hasura-Role': 'admin',
            Authorization: authHeader,
        },
        data: {
            query: print(getCheckConversionQuery(type)),
            variables: {
                s3Key,
            },
        },
    });

    const [conversation] = path(
        ['data', `${type}_conversions_in_flight`],
        data
    ) as any;

    if (conversation.status === 'complete') {
        if (type === 'footage') {
            onSuccess();
        } else if (type === 'telestration') {
            const { video_url } = s3KeyToUrl(conversation.output_s3_key);
            onStartDownload();
            downloadFile({
                name,
                videoURL: video_url + '.mp4',
                onSuccess,
            });
        }
    } else {
        setTimeout(
            () =>
                checkConversationStatus(
                    s3Key,
                    name,
                    onSuccess,
                    onStartDownload,
                    type
                ),
            2000
        );
    }
};

export const beamVideo = async (uploadVideoOpts: IUploadVideo) => {
    const {
        onSuccess,
        onStartConversion,
        onStartDownload,
        title,
        type,
    } = uploadVideoOpts;
    // Send to s3
    const beamOpts = await _beamToS3(uploadVideoOpts);
    const s3Key = path(['form-data', 'key'], beamOpts) as string;
    // Notify our backend
    // TODO Need to distinguish FOOTAGE uploads from
    // telestration uploads.
    await _notifyServerOfS3Upload({
        ...uploadVideoOpts,
        s3Key,
    });

    if (onStartConversion) {
        onStartConversion();
        checkConversationStatus(s3Key, title, onSuccess, onStartDownload, type);
    } else if (onSuccess) {
        onSuccess();
    }

    return { success: true };
};

export const s3KeyToUrl = (k: string) => {
    const relativeUrl = k.split('/').map(encodeURIComponent).join('/');
    return {
        video_url: process.env.REACT_APP_S3_URI + relativeUrl,
    };
};

const AwsConfigV = t.type({
    bucketName: t.string,
    bucketRegion: t.string,
    identityPoolId: t.string,
});

type AwsConfig = t.TypeOf<typeof AwsConfigV>;

const envConfig = {
    bucketName: process.env.REACT_APP_BUCKET_NAME,
    bucketRegion: process.env.REACT_APP_BUCKET_REGION,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
};

export const getS3 = () => {
    const config = AwsConfigV.decode(envConfig);

    if (config.isRight()) {
        const conf: AwsConfig = config.value;

        AWS.config.update({
            region: conf.bucketRegion,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: conf.identityPoolId,
            }),
        });

        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: conf.bucketName },
        });

        return right(s3);
    } else {
        return left(Error('Unable to get S3 config.'));
    }
};

interface IDownloadBlobOpts {
    name: string;
    videoURL: string;
    onSuccess: () => void;
}

export const downloadFile = async ({
    name,
    videoURL,
    onSuccess,
}: IDownloadBlobOpts) => {
    try {
        const blob = await fetch(videoURL).then((result) => result.blob());
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.style.display = 'none';
        link.href = url;
        link.download = name + '.mp4';
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            onSuccess();
        }, 1);
    } catch (error) {
        console.error(error);
    }
};
