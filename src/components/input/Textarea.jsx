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

export const TextArea = ({ name, label, value = '' }) => {
    const textareaRef = useRef(null);

    const handleCopy = async () => {
        await copyToClipboard(textareaRef, message);
    };

    return (
        <Form.Item
            name={name}
            label={label}
        >
            <Space.Compact
                style={{
                    width: '100%',
                }}
            >
                <Input.TextArea
                    defaultValue={value}
                    ref={textareaRef}
                    rows={4}
                    style={{
                        width: '100%',
                    }}
                />
                <Button icon={<CopyOutlined />} onClick={handleCopy} />
            </Space.Compact>
        </Form.Item>
    );
};
