import styled from "styled-components";

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.navbar};
  padding: 0px 25px;

  @media (max-width: ${({ theme }) => theme.mobile}) {
    flex-direction: column;
    padding: 0px 0px;
    padding-bottom: 15px;
  }
`;

export const Logo = styled.img`
  width: 60px;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    align-items: center;
    margin-top: 10px;
  } ;
`;

export const Title = styled.text`
  width: 100%;
  padding: 10px;
  text-align: start;
  color: ${({ theme }) => theme.colors.textClear};
  font-size: 2rem;
  text-transform: uppercase;
  font-weight: 900;

  @media (max-width: ${({ theme }) => theme.mobile}) {
    margin-top: 0px;
    text-align: center;
  } ;
`;
