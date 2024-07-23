/*
[
    {
        "tab": "default",
        "form": [
            {
                "component": "input",
                "props": {
                    "label": "aaaa",
                    "name": "aaaa-1720956523464"
                }
            }
        ]
    }
]
*/

export const migrate0002 = (data) => {
    if (data === null) {
        return [];
    }

    if (typeof data !== 'object' || Array.isArray(data)) {
        return data;
    }

    const result = [];
    Object.keys(data).forEach((key) => {
        result.push({
            tab: key,
            form: data[key],
        });
    });
    return result;
};
