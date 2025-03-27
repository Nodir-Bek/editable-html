import styled, { css } from "styled-components";

export const StyledButton = styled.button<ButtonProps>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  ${({ variant }) => {
    switch (variant) {
      case "primary":
        return css`
          background: #007bff;
          color: #fff;
          border: 1px solid #007bff;
        `;
      case "secondary":
        return css`
          background: #6c757d;
          color: #fff;
          border: 1px solid #6c757d;
        `;
      default:
        return "";
    }
  }}

  ${({ size }) => {
    switch (size) {
      case "small":
        return css`
          font-size: 0.8rem;
          padding: 4px 8px;
        `;
      case "large":
        return css`
          font-size: 1.2rem;
          padding: 8px 16px;
        `;
      default:
        return "";
    }
  }}

  &:hover {
    background: ${({ variant }) =>
      variant === "primary" ? "#0056b3" : "#5a6268"};
  }

  &:disabled {
    background: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;
