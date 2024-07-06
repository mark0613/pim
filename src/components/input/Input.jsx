import { BaseInput } from './BaseInput';

export const Input = ({ name, label, value = '' }) => (
    <BaseInput
        name={name}
        label={label}
        value={value}
        type="text"
    />
);
