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

export const SectionHeader = styled.div`
  padding-bottom: 10px;
`;

export const SectionTitle = styled.div`
  padding-left: 10px;
  padding-bottom: 15px;
  text-transform: uppercase;
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textTertiary};

  @media (max-width: ${({ theme }) => theme.mobile}) {
    font-size: 1.7rem;
  } ;
`;

export const IngredintSectionTitle = styled.div`
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: 800;
`;

export const Element = styled.div`
  background-color: ${({ theme }) => theme.colors.container};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.3rem;
  padding: 0.5rem;
  position: relative;
  font-size: 1rem;
  border-radius: 0.5rem;
`;

export const ElementOrdered = styled.div`
  background-color: ${({ theme }) => theme.colors.container};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.3rem;
  padding-top: 0.23rem;
  padding-bottom: 0.3rem;
  position: relative;
  font-size: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.shadow};
`;

export const Product = styled.div`
  text-align: start;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 1rem;
  color: white;
`;

export const Details = styled.div`
  text-align: start;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Price = styled.div`
  text-align: end;
  padding-left: 15px;
  padding-right: 15px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;
