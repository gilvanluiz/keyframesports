import { ILocalStateMgr } from '../../../App/LocalState';

export interface IProps {
    classes: any;
    history?: any;
    localStateMgr: ILocalStateMgr;
}

export interface ILoginForm {
    username: string;
    password: string;
    errors: {
        state: boolean;
        serverErrors: string;
    };
}

export interface IRegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organizationName: string;
    password: string;
    emailOptIn: boolean;
    errors: {
        state: boolean;
        serverErrors: string;
    };
    role: {
        select: string;
        other: string;
    };
    purpose: {
        select: string;
        other: string;
    };
    'referral-source': {
        select: string;
        other: string;
    };
}
