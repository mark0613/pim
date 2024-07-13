import { BaseInput } from './BaseInput';

export const PasswordInput = ({ name, label, value = '', style = {} }) => (
    <BaseInput
        name={name}
        label={label}
        value={value}
        type="password"
        style={style}
    />
);
