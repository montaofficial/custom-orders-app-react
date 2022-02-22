import styled from "styled-components";

export const Span = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.fill};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  font-size: 1.5rem;
  font-weight: 900;
  min-height: 40px;
  min-width: 30px;
  border-radius: 0.3rem;
`;
