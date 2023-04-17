import { IUserEvents } from '.';

interface IUserEventsCollectedData {
    'user-activity.event/type': string;
    'user-activity.event/occurred-at': string;
    'user-activity.event/logged-at': string;
    'user-management.user/id': string;
    'user-activity.event/url': string;
    'telestrations.game-footage/id'?: string;
}

const url = process.env.REACT_APP_ALEPH_URI;

async function sendEvent(collectedData: IUserEventsCollectedData) {
    try {
        await fetch(url + '/api-v1/ua/events/log', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collectedData),
        });
    } catch (error) {
        console.error(error);
    }
}

function collectUserActionData(
    userEvent: IUserEvents,
    location: string,
    videoId?: string
): void {
    const time = new Date();
    const userId: string = localStorage.getItem('userId') || '';
    const collectedData: IUserEventsCollectedData = {
        'user-activity.event/type': userEvent,
        'user-activity.event/occurred-at': time.toISOString(),
        'user-activity.event/logged-at': time.toISOString(),
        'user-management.user/id': userId,
        'user-activity.event/url': location,
    };
    if (userEvent.includes('telestration') || videoId) {
        if (videoId) {
            collectedData['telestrations.game-footage/id'] = videoId;
        } else {
            console.error('videoId missed');
        }
    }
    if (userId !== '') {
        sendEvent(collectedData);
    }
}

export const sendUserEvent = collectUserActionData;
