import styled from "styled-components";

export const Menu = styled.div`
  background-color: ${({ theme }) => theme.colors.container};
  border-radius: 1rem;
`;

export const Section = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: 10px 10px;
  margin: 12px 0;
  position: relative;
  border-radius: 0.5rem;
`;

export const SectionTitle = styled.div`
  padding-bottom: 15px;
`;

export const Element = styled.div`
  background-color: ${({ theme }) => theme.colors.container};
  color: ${({ theme }) => theme.colors.textClear};
  margin-bottom: 0.3rem;
  padding-top: 0.23rem;
  padding-bottom: 0.3rem;
  position: relative;
  font-size: 1rem;
  border-radius: 0.5rem;
`;

export const Product = styled.text`
  padding-left: 1rem;
  text-align: start;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 1rem;
  color: white;
`;

export const Details = styled.text`
  text-align: start;
  color: ${({ theme }) => theme.colors.textClear};
`;
