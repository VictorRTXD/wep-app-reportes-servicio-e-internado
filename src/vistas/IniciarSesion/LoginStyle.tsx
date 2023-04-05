import styled from 'styled-components';
import fondo from '../../recursos/fondo.jpg';

interface IProps{
  color: string;
  size: string;
}

export const ContainerLogin = styled.div`
  position: absolute;
  width: 80%;
  height: 70%;
  left: 150px;
  top: 114px;
  background: #FFFFFF;
  mix-blend-mode: normal;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    position: relative;
    flex-direction: column-reverse;
    flex-wrap: nowrap;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    border-radius: 0px;
    box-shadow: 0px 0px 0px;
  }
`;
export const DIV = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #EAECEE;
  @media (max-width: 768px) {
    position: relative;
  }

`;
export const ContainerName = styled.div`
  width: 50%;
  height: 100%;
  background-image: url(${fondo});
  background-size: 120%;
  background-repeat: no-repeat;
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
  
`;
export const ContainerTitle = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(224, 124, 67, 0.79);
  justify-content: center;
  display: flex;
  flex-direction: column;

`;
export const Title = styled.span`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Roboto+Flex:opsz,wght@8..144,300&display=swap');
  font-family: 'Lato', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: ${({ size }: IProps) => size};
  line-height: 38px;
  margin: 0 auto;
  color: ${({ color }: IProps) => color};
  margin-top: 3%;
  margin-bottom: 3%;
  @media (max-width: 768px) {
    width: 100%;
    align-self: center;
    text-align: center;

  }


`;
export const ContainerInput = styled.div`
  width: 50%;
  height: 100%;
  @media (max-width: 768px) {
    width: 100%;
  }

`;
export const CL = styled.div`
  width: 60%;
  height: 100%;
  margin: 0 auto;
  justify-content: center;
  margin-top: 15%;
  @media (max-width: 768px) {
    width: 70%;
  }
`;
