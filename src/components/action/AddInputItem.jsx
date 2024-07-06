import { useEffect, useState } from 'react';

import {
    Button,
    Input,
    Select,
    Space,
    Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { InputType, InputTypeLabel } from '../../constants/input';

const { Text } = Typography;

export const AddInputItem = ({ onAdd = () => {} }) => {
    const [needValidate, setNeedValidate] = useState(false);
    const [type, setType] = useState(InputType.INPUT);
    const [label, setLabel] = useState('');
    const [error, setError] = useState(false);

    const validate = () => {
        const isLabelEmpty = label.trim() === '';
        setError(isLabelEmpty);
        return !isLabelEmpty;
    };

    const handleAdd = () => {
        if (validate()) {
            onAdd({ type, label });
            setNeedValidate(false);
            setLabel('');
        }
    };

    useEffect(() => {
        if (needValidate) {
            validate();
        }
        else {
            setNeedValidate(true);
        }
    }, [label]);

    return (
        <Space>
            <Select
                value={type}
                onChange={setType}
                options={
                    Object.entries(InputTypeLabel).map(([value, lab]) => ({
                        label: lab,
                        value,
                    }))
                }
                style={{ width: 120 }}
            />
            <Space direction="vertical" style={{ rowGap: 0 }}>
                <Input
                    status={error ? 'error' : ''}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Label"
                />
                <Text
                    type="danger"
                    style={{
                        display: error ? 'block' : 'none',
                        fontSize: 12,
                        position: 'absolute',
                        marginLeft: '8px',
                    }}
                >
                    Label is required
                </Text>
            </Space>
            <Button
                icon={<PlusOutlined />}
                onClick={handleAdd}
            >
                Add
            </Button>
        </Space>
    );
};
