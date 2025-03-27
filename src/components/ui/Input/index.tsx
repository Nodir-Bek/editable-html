
import { InputWrapper, StyledInput } from './style';


export const Input: React.FC<InputProps> = ({ label, ...rest }) => {
    return (
        <InputWrapper>
            {label && <label>{label}</label>}
            <StyledInput {...rest} />
        </InputWrapper>
    );
};
