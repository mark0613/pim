import { Input } from './Input';
import { PasswordInput } from './PasswordInput';
import { TextArea } from './Textarea';

export class InputFactory {
    static create({ type }) {
        switch (type) {
            case 'input':
                return Input;
            case 'password':
                return PasswordInput;
            case 'textarea':
                return TextArea;
            default:
                console.error(`Unknown input type: "${type}"`);
                return Input;
        }
    }
}
