import * as React from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
} from '@material-ui/core';
import { InputField, ChangeHandler, IFormState } from './types';

interface IInputFieldProps {
    field: InputField;
    handleChange: ChangeHandler;
    formState: IFormState;
}

export const InputElement = ({
    field,
    handleChange,
    formState,
}: IInputFieldProps) => {
    switch (field.type) {
        case 'text': {
            const stateVal = formState[field.name] || '';
            return (
                <TextField
                    key={field.name}
                    margin='dense'
                    id={`create-case-${field.name}`}
                    label={field.label}
                    type={field.type}
                    fullWidth
                    onChange={handleChange(field.name)}
                    value={stateVal}
                />
            );
        }
        case 'select': {
            const htmlId = `case-${field.name}`;
            return (
                <FormControl key={field.name} style={{ minWidth: '300px' }}>
                    <InputLabel htmlFor={htmlId}>Category</InputLabel>
                    <Select
                        value={formState[field.name]}
                        onChange={() => handleChange(field.name)}
                        id={`create-case-${field.name}`}
                        inputProps={{
                            name: htmlId,
                            id: htmlId,
                        }}
                    >
                        {field.options.map((option) => (
                            <MenuItem value={option.value} key={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        case 'divider': {
            return <Divider />;
        }
        default: {
            throw Error(`Field ${field} not supported`);
        }
    }
};
