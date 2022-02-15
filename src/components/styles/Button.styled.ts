import styled from "styled-components";

export const Button = styled.button<{ bg: string; color: string } | any>`
  border-radius: 50px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.fill};
  color: ${({ theme }) => theme.colors.textDark};

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.shadow};
  }
`;

export const AddButton = styled.button<{ bg: string; color: string } | any>`
  border-radius: 10px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  width: 45px;
  height: 45px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.fill};
  color: ${({ theme }) => theme.colors.textDark};

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.shadow};
  }
`;

export const CreateButton = styled.button<{ bg: string; color: string } | any>`
  border-radius: 10px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: 900;
  background-color: ${({ theme }) => theme.colors.fill};
  color: ${({ theme }) => theme.colors.textDark};

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.shadow};
  }
`;
