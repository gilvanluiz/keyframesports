import * as React from 'react';

export type ChangeHandler = (name: string) => (e: React.ChangeEvent) => any;
export interface IFormState {
    [name: string]: string;
}

export interface ITextField {
    type: 'text';
    name: string;
    label: string;
}
export interface ISelectOpt {
    label: string;
    value: string | number;
}
export interface ISelectField {
    type: 'select';
    name: string;
    label: string;
    options: ISelectOpt[];
}
export interface IDivider {
    type: 'divider';
    name: string;
}

export type InputField = ITextField | IDivider | ISelectField;
