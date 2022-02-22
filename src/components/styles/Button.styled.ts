import styled from "styled-components";

export const Button = styled.button<{ disabled: boolean } | any>`
  border-radius: 50px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.fill};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.shadow};
  }

  &:disabled {
    filter: grayscale(8);
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 0px ${({ theme }) => theme.colors.shadow};
  }
`;

export const EditButton = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  border-radius: 10px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  width: 45px;
  height: 45px;
  max-width: 45px;
  max-height: 45px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.fill};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    opacity: 0.9;
    transform: scale(1.04);
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.shadow};
  }
`;

export const EditButtonOrdered = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
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
  color: ${({ theme }) => theme.colors.textSecondary};

  box-shadow: 0 0 10px ${({ theme }) => theme.colors.shadow};
`;

export const AddButton = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
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
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: 30px;
  margin-right: 30px;

  &:hover {
    opacity: 0.9;
    transform: scale(1.04);
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.shadow};
  }
`;

export const DisabledAddButton = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  border-radius: 10px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  width: 45px;
  height: 45px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.fill};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-left: 30px;
  margin-right: 30px;
  filter: grayscale(8);
`;

export const CreateButton = styled.div`
  border-radius: 10px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: 900;
  background-color: ${({ theme }) => theme.colors.fill};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.shadow};
  }
`;
