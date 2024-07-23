import { useRef } from 'react';

import {
    Button,
    Form,
    Input,
    message,
    Space,
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';

import { copyToClipboard } from '../../utils/clipboard';

export const BaseInput = ({ name, label, value = '', type = 'text', style = {} }) => {
    const inputRef = useRef(null);
    const InputComponent = type === 'password' ? Input.Password : Input;

    const handleCopy = async () => {
        await copyToClipboard(inputRef, message);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    return (
        <Form.Item
            name={name}
            label={label}
            style={style}
        >
            <Space.Compact style={{ width: '100%' }}>
                <InputComponent
                    defaultValue={value}
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                />
                <Button icon={<CopyOutlined />} onClick={handleCopy} />
            </Space.Compact>
        </Form.Item>
    );
};
