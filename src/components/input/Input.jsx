import { BaseInput } from './BaseInput';

export const Input = ({ name, label, value = '', style = {} }) => (
    <BaseInput
        name={name}
        label={label}
        value={value}
        type="text"
        style={style}
    />
);
