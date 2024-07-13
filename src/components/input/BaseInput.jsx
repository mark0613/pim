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

    return (
        <Form.Item
            name={name}
            label={label}
            style={style}
        >
            <Space.Compact style={{ width: '100%' }}>
                <InputComponent defaultValue={value} ref={inputRef} />
                <Button icon={<CopyOutlined />} onClick={handleCopy} />
            </Space.Compact>
        </Form.Item>
    );
};
