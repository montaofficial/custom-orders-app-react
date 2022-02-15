import styled from "styled-components";

export const DialogBase = styled.button`
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

export const DialogContent = styled.button`
  background-color: transparent;
  border: none;
  position: fixed;
  left: 0;
  right: 0;
  top: 14vh;
  margin-left: auto;
  margin-right: auto;
  width: 480px; /* Need a specific value to work */
  height: 350px;
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

export const AlertBox = styled.button`
  width: 100%;
  height: 100%;
  color: #ffffff;
  background-color: ${({ theme }) => theme.colors.background};
  border: solid 1px ${({ theme }) => theme.colors.fill};
  padding: 38px 18px;
  border-radius: 12px;
`;
