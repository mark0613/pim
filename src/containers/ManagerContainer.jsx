/* eslint-disable react/jsx-props-no-spreading */

import { useEffect, useState } from 'react';

import {
    Button,
    Card,
    Empty,
    Form,
    message,
    Space,
    Spin,
    Typography,
} from 'antd';
import {
    CloseCircleOutlined,
    SaveOutlined,
} from '@ant-design/icons';

import { ElectronApi } from '../api';
import { AddInputItem } from '../components/action';
import { InputFactory } from '../components/input';
import { InputType } from '../constants/input';

const { Text, Title } = Typography;

const completeData = (data) => (
    data.map(({ component, props }) => {
        const name = props.name || `${props.label.toLowerCase()}-${Date.now()}`;
        return {
            component,
            props: {
                ...props,
                name,
            },
        };
    })
);

const getFormDefaultValues = (data) => (
    data.reduce(
        (acc, { component, props }) => {
            if (Object.values(InputType).includes(component)) {
                return {
                    ...acc,
                    [props.name]: props.value || '',
                };
            }
            return acc;
        },
        {},
    )
);

const EmptyData = () => (
    <Empty
        description={(
            <Space direction="vertical">
                <Title level={4} type="secondary">沒有資料</Title>
                <Text type="secondary">試試點擊下方的 Add 新增一個欄位吧！</Text>
            </Space>
        )}
        style={{
            marginBottom: '16px',
        }}
    />
);

const FormItemData = ({ data, onDelete = () => {} }) => (
    data.map(({ component, props }, index) => {
        const Component = InputFactory.create({ type: component });

        return (
            <WithDeleteButton
                key={props.name}
                onDelete={() => onDelete(index)}
            >
                <Component
                    key={props.name}
                    style={{ flex: 'auto' }}
                    {...props}
                />
            </WithDeleteButton>
        );
    })
);

const WithDeleteButton = ({ children, onDelete = () => {}, ...props }) => (
    <div
        style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'start',

        }}
        {...props}
    >
        <Button
            type="text"
            danger
            icon={<CloseCircleOutlined />}
            onClick={onDelete}
            style={{
                height: '100%',
            }}
        />
        {children}
    </div>
);

export const ManagerContainer = () => {
    const [initializing, setInitializing] = useState(true);
    const [formItemData, setFormItemData] = useState([]);
    const [saving, setSaving] = useState(false);

    const addItem = ({ type, label }) => {
        const name = `${label.toLowerCase()}-${Date.now()}`;
        setFormItemData([
            ...formItemData,
            {
                component: type,
                props: {
                    label,
                    value: '',
                    name,
                },
            },
        ]);
    };

    const handleSave = async (values) => {
        const toSaveData = [...formItemData];
        Object.keys(values).forEach((key) => {
            const item = toSaveData.find(({ props }) => props.name === key);
            if (item) {
                item.props.value = values[key];
            }
        });
        try {
            setSaving(true);
            await ElectronApi.setData({ default: toSaveData });
            message.success('儲存成功');
        }
        catch (e) {
            console.error(e);
            message.error('儲存失敗... 為啥?');
        }
        setSaving(false);
    };

    const handleDelete = (index) => {
        const data = [...formItemData];
        data.splice(index, 1);
        setFormItemData(data);
    };

    useEffect(() => {
        (async () => {
            const data = await ElectronApi.getData();
            setFormItemData(completeData(data));
            setInitializing(false);
        })();
    }, []);

    if (initializing) {
        return <Spin size="large" />;
    }

    const initialValues = {
        ...getFormDefaultValues(formItemData),
        inputType: InputType.INPUT,
    };

    return (
        <Form
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleSave}
        >
            {
                (formItemData.length === 0)
                    ? (
                        <EmptyData />
                    )
                    : (
                        <FormItemData
                            data={formItemData}
                            onDelete={handleDelete}
                        />
                    )
            }
            <Space direction="vertical">
                <Card
                    style={{
                        border: '1px dashed #d9d9d9',
                    }}
                >
                    <AddInputItem onAdd={addItem} />
                </Card>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={saving}
                >
                    Save
                </Button>
            </Space>
        </Form>
    );
};
