import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledInput = styled.input<InputProps>`
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #000;

  &:focus {
    outline: none;
    border-color: #c0c0c0;
  }

  &::placeholder {
    color: #9cf0a4;
  }
`;
