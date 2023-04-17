import createService from './provider';

const serviceConfig = {
    login: {
        url: '/api-v1/authentication/login',
        method: 'POST',
    },
    register: {
        url: '/api-v1/team-management/create-team',
        method: 'POST',
    },
    deleteVideo: {
        url: '/api-v1/video/',
        method: 'DELETE',
    },
    saveFeedback: {
        url: '/api-v1/feedback/save-feedback',
        method: 'POST',
    },
    sendCallBackRequest: {
        url: '/api-v1/subscriptions/contact',
        method: 'POST',
    },
    checkoutSession: {
        url: '/api-v1/stripe/checkout-session',
        method: 'POST',
        authRequired: true,
    },
    confirmCheckoutSession: {
        url: '/api-v1/stripe/checkout-session/confirm',
        method: 'POST',
        authRequired: true,
    },
};

const services = createService(serviceConfig, null) as {
    login: any;
    register: any;
    saveFeedback: any;
    sendCallBackRequest: any;
    deleteVideo: any;
    checkoutSession: any;
    confirmCheckoutSession: any;
};

export default services;
