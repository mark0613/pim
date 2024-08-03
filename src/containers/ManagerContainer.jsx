/* eslint-disable react/jsx-props-no-spreading */

import { useEffect, useState } from 'react';

import {
    Button,
    Card,
    Empty,
    Form,
    message,
    Modal,
    Space,
    Spin,
    Tabs,
    Typography,
} from 'antd';
import {
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    SaveOutlined,
} from '@ant-design/icons';

import { ElectronApi } from '../api';
import { AddInputItem } from '../components/action';
import { EditableText, InputFactory } from '../components/input';
import { InputType } from '../constants/input';

const { Text, Title } = Typography;

const fillData = (formData) => (
    formData.map(({ component, props }) => {
        const name = props.name || `${Date.now()}`;
        const value = props.value || '';
        return {
            component,
            props: {
                ...props,
                name,
                value,
            },
        };
    })
);

const convertRawData = (data) => {
    const result = {};
    data.forEach(({ tab, form }) => {
        result[tab] = [...fillData(form)];
    });
    return result;
};

const getFormDefaultValues = (data) => {
    const result = {};
    Object.values(data).forEach((form) => {
        form.forEach(({ component, props }) => {
            if (Object.values(InputType).includes(component)) {
                result[props.name] = props.value;
            }
        });
    });
    return result;
};

const generateTabFormItems = ({
    data,
    onInputAdd = () => {},
    onInputDelete = () => {},
    onTabRename = () => {},
}) => {
    const tabChildrenMap = {};
    Object.entries(data).forEach(([tab, form]) => {
        tabChildrenMap[tab] = form.map(({ component, props }, index) => {
            const Component = InputFactory.create({ type: component });
            return (
                <WithDeleteButton
                    key={props.name}
                    onDelete={() => onInputDelete({ tab, index })}
                >
                    <Component
                        key={props.name}
                        style={{ flex: 'auto' }}
                        {...props}
                    />
                </WithDeleteButton>
            );
        });
    });

    const validate = (text) => {
        if (text.trim() === '') {
            message.error('標籤不能為空');
            return false;
        }

        if (tabChildrenMap[text]) {
            message.error(`標籤 '${text}' 重複`);
            return false;
        }

        return true;
    };

    const items = Object
        .entries(tabChildrenMap)
        .map(([tab, children], index) => (
            {
                label: (
                    <EditableText
                        value={tab}
                        validate={validate}
                        onSubmit={(newTab) => onTabRename(tab, newTab)}
                        style={{
                            width: '80px',
                        }}
                    />
                ),
                key: tab,
                children: (
                    <>
                        {
                            children.length > 0
                                ? children
                                : <EmptyData />
                        }
                        <Card
                            style={{
                                border: '1px dashed #d9d9d9',
                            }}
                        >
                            <AddInputItem
                                onAdd={(props) => onInputAdd({ tab, ...props })}
                            />
                        </Card>
                    </>
                ),
                closable: index !== 0,
                forceRender: true,
            }
        ));
    return items;
};

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
    const [formTabItemData, setFormTabItemData] = useState({});
    const [activeTab, setActiveTab] = useState('');
    const [saving, setSaving] = useState(false);

    const [modal, contextHolder] = Modal.useModal();

    const addTabItem = () => {
        let { length } = Object.keys(formTabItemData);
        let tab = `new-${length}`;
        while (formTabItemData[tab]) {
            length += 1;
            tab = `new-${length}`;
        }
        setFormTabItemData({
            ...formTabItemData,
            [tab]: [],
        });
        setActiveTab(tab);
    };

    const removeTabItem = (targetKey) => {
        const newTab = { ...formTabItemData };
        delete newTab[targetKey];
        setFormTabItemData(newTab);
        setActiveTab(Object.keys(newTab)[0]);
    };

    const confirmRemoveTabItem = (targetKey) => {
        modal.confirm({
            title: '注意',
            icon: <ExclamationCircleOutlined />,
            content: '此標籤底下還有資料，確定要刪除嗎？',
            okText: '確認',
            cancelText: '取消',
            onOk: () => {
                removeTabItem(targetKey);
            },
        });
    };

    const handleTabEdit = (targetKey, action) => {
        if (action === 'add') {
            addTabItem('new');
        }
        else if (action === 'remove') {
            if (formTabItemData[targetKey].length > 0) {
                confirmRemoveTabItem(targetKey);
            }
            else {
                removeTabItem(targetKey);
            }
        }
    };

    const handleTabRename = (oldTab, newTab) => {
        const newTabData = { ...formTabItemData };
        newTabData[newTab] = newTabData[oldTab];
        delete newTabData[oldTab];
        setFormTabItemData(newTabData);
        setActiveTab(newTab);
    };

    const addInputItem = ({ tab, type, label }) => {
        const name = `${Date.now()}`;
        const oldData = formTabItemData[tab];
        const newData = [
            ...oldData,
            {
                component: type,
                props: {
                    label,
                    value: '',
                    name,
                },
            },
        ];
        setFormTabItemData({
            ...formTabItemData,
            [tab]: newData,
        });
    };

    const handleSave = async (values) => {
        const toSaveData = Object.entries(formTabItemData).reduce(
            (acc, [tab, form]) => [
                ...acc,
                {
                    tab,
                    form: form.map(({ component, props }) => ({
                        component,
                        props: {
                            ...props,
                            value: values[props.name],
                        },
                    })),
                },
            ],
            [],
        );

        try {
            setSaving(true);
            await ElectronApi.setData(toSaveData);
            message.success('儲存成功');
        }
        catch (e) {
            console.error(e);
            message.error('儲存失敗... 為啥?');
        }
        setSaving(false);
    };

    const handleDelete = ({ tab, index }) => {
        const data = formTabItemData[tab];
        const newData = data.filter((_, i) => i !== index);
        setFormTabItemData({
            ...formTabItemData,
            [tab]: newData,
        });
    };

    useEffect(() => {
        (async () => {
            const data = convertRawData(await ElectronApi.getData());
            setFormTabItemData(data);
            setInitializing(false);
            setActiveTab(Object.keys(data)[0]);
        })();
    }, []);

    if (initializing) {
        return <Spin size="large" />;
    }

    const initialValues = {
        ...getFormDefaultValues(formTabItemData),
        inputType: InputType.INPUT,
    };

    return (
        <>
            <Form
                layout="vertical"
                initialValues={initialValues}
                onFinish={handleSave}
                style={{
                    width: '100%',
                }}
            >
                <Tabs
                    type="editable-card"
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    tabBarExtraContent={(
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={saving}
                        >
                            Save
                        </Button>
                    )}
                    items={
                        generateTabFormItems({
                            data: formTabItemData,
                            onInputAdd: addInputItem,
                            onInputDelete: handleDelete,
                            onTabRename: handleTabRename,
                        })
                    }
                    onEdit={handleTabEdit}
                    style={{
                        width: '100%',
                    }}
                />
            </Form>
            {contextHolder}
        </>
    );
};
