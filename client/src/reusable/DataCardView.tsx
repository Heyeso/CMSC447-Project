import React from "react";
import styled from "styled-components";
import { COLORS } from "../utils/constants";

const DataCardViewContainer = styled.article`
  &.quick-view {
    cursor: pointer;
  }
  padding: 20px 30px;
  font-family: "Montserrat", sans-serif;
  background-color: ${COLORS.WHITE};
  width: 500px;
  height: 400px;
  margin: 15px 20px;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
  border-radius: 0.5px solid ${COLORS.GRAY6};
  color: ${COLORS.BLACK};
  @media (hover: hover) {
    :hover {
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      transition: box-shadow 0.3s;
    }
  }
`;
const Header = styled.h1`
  font-weight: 600;
  font-size: 14px;
  margin: 15px 0 10px;
  padding: 0;
  text-transform: uppercase;
`;
const Content = styled.div`
  margin: 0;
  margin-top: auto;
  margin-bottom: 10px;
  padding: 0;
`;

interface Props {
  title: string;
  children: any;
  className?: string;
  onClick?: () => void;
}
const DataCardView = ({ title, children, ...rest }: Props) => {
  return (
    <DataCardViewContainer {...rest}>
      <Header>{title}</Header>
      <Content>{children}</Content>
    </DataCardViewContainer>
  );
};

export default DataCardView;
