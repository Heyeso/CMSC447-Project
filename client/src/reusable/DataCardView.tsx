import React from "react";
import styled from "styled-components";
import { COLORS } from "../utils/constants";

const DataCardViewContainer = styled.article`
  &.quick-view {
    cursor: pointer;
  }
  padding: 10px 20px 20px;
  font-family: "Montserrat", sans-serif;
  background-color: ${COLORS.WHITE};
  width: 500px;
  height: 350px;
  margin: 15px 20px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 4px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
  border-radius: 0.5px solid ${COLORS.GRAY6};
  @media (hover: hover) {
    :hover {
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      transition: box-shadow 0.3s;
    }
  }
`;
const Header = styled.h1`
  font-weight: 600;
  font-size: 18px;
  margin: 15px 0 10px;
  padding: 0;
`;
const Content = styled.div`
  margin: auto 0;
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
