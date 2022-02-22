import styled from "styled-components";

export const DialogBase = styled.div`
  background: white;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5000;
  height: 100%;
  width: 100%;

  backdrop-filter: blur(2px);
`;

export const DialogContent = styled.div`
  background-color: transparent;
  border: none;
  position: fixed;
  left: 0;
  right: 0;
  top: 14vh;
  margin-left: auto;
  margin-right: auto;
  width: 480px; /* Need a specific value to work */
  overflow: hidden;
  z-index: 5001;

  @media (max-width: 530px) {
    width: 420px;
  }

  @media (max-width: 440px) {
    width: 320px;
  }

  @media (max-width: 340px) {
    width: 280px;
  } ;
`;

export const AlertBox = styled.div`
  width: 100%;
  min-height: 300px;
  height: 100%;
  color: #ffffff;
  background-color: ${({ theme }) => theme.colors.background};
  border: solid 1px ${({ theme }) => theme.colors.fill};
  padding: 38px 18px;
  border-radius: 12px;
`;

export const DialogTitle = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-size: 2.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const DialogText = styled.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-bottom: 20px;
`;

export const DialogProp = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
`;

export const SizeName = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 800;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 5px;
`;
