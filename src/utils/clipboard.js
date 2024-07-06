export const copyToClipboard = async (ref, messageHook) => {
    const text = (
        ref.current.resizableTextArea
            ? ref.current.resizableTextArea.textArea.value
            : ref.current.input.value
    );

    try {
        await navigator.clipboard.writeText(text);
        messageHook.success('已複製到剪貼簿');
    }
    catch (err) {
        messageHook.error(`複製失敗: ${err.message}`);
    }
};
