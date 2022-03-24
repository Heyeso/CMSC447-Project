import React from "react";
import styled from "styled-components";
import { constButtons, ButtonTags, COLORS } from "../utils/constants";

interface ButtonProps {
  tag: ButtonTags;
  color?: string;
  backgroundColor?: string;
  margin?: string;
}
const ButtonContainer = styled.button<ButtonProps>`
  cursor: pointer;
  box-sizing: border-box;
  height: fit-content;
  width: fit-content;
  padding: 10px 30px;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  border-radius: 10px;
  background-color: ${COLORS.WHITE};
  margin: ${(props) => props.margin || "0"};
  border: 2px solid ${(props) => props.color || constButtons[props.tag].color};
  color: ${(props) => props.color || constButtons[props.tag].color};
  outline: none;
  :hover {
    color: ${COLORS.WHITE};
    background-color: ${(props) =>
      props.color || constButtons[props.tag].backgroundColor};
  }
`;

interface Props extends ButtonProps {
  children?: string;
  className?: string;
  onClick?: () => void;
}
const Buttons = ({ children, ...rest }: Props) => {
  return <ButtonContainer {...rest}>{children}</ButtonContainer>;
};

export default Buttons;
