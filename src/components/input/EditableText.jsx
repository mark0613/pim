import { useState } from 'react';

import { Input } from 'antd';

export const EditableText = ({
    value = '',
    style = {},
    validate = () => {},
    onSubmit = () => {},
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value);

    const submit = () => {
        const isValidate = validate(text);
        if (isValidate) {
            onSubmit(text);
        }
        else {
            setText(value);
        }
        setIsEditing(false);
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setText(e.target.value);
    };

    const handleBlur = () => {
        submit();
    };

    const handleKeyDown = (event) => {
        event.stopPropagation();
        if (event.key === 'Enter') {
            event.preventDefault();
            submit();
        }
    };

    return (
        <div onDoubleClick={handleDoubleClick}>
            {isEditing
                ? (
                    <Input
                        value={text}
                        autoFocus
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        style={style}
                    />
                )
                : (
                    <span>{text}</span>
                )}
        </div>
    );
};
