import React from 'react';
import { StyledButton } from './style';
 



export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    disabled = false,
    onClick,
    children,
     
}) => {
    return (
        <StyledButton
            variant={variant}
            size={size}
            disabled={disabled}
            onClick={onClick}
            
        >
            {children}
        </StyledButton>
    );
};
