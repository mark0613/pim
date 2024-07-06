import { BaseInput } from './BaseInput';

export const PasswordInput = ({ name, label, value = '' }) => (
    <BaseInput
        name={name}
        label={label}
        value={value}
        type="password"
    />
);
