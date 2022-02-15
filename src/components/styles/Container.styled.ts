import styled from "styled-components";

export const Container = styled.div`
  width: auto;
  max-width: 100%;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.colors.background};

  @media (max-width: ${({ theme }) => theme.mobile}) {
    padding: 0 0px;
  } ;
`;
