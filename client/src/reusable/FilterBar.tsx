import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { COLORS } from "../utils/constants";
import { ReactComponent as CheckIcon } from "./../assets/check.icon.svg";

const FilterBarContainer = styled.div`
  position: relative;
  padding: 0;
  font-family: "Montserrat", sans-serif;
  letter-spacing: -0.5px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: fit-content;
  margin-bottom: 20px;
`;
const Header = styled.h1`
  font-weight: 600;
  font-size: 16px;
  margin: 0 0 7px 0;
  padding: 0;
  color: ${COLORS.TEXT1};
  width: 100%;
`;
const SelectContainer = styled.div`
  cursor: pointer;
  width: 100%;
  height: 45px;
  border: 2px solid ${COLORS.CONFIRM};
  box-sizing: border-box;
  border-radius: 10px;
  display: flex;
  align-items: center;
  @media (hover: hover) {
    :hover {
      background-color: rgba(45, 155, 219, 0.1);
    }
  }
  span {
    margin: 0;
    margin-left: 20px;
    color: ${COLORS.CONFIRM};
    font-weight: 600;
    font-size: 16px;
  }
  svg {
    margin-left: auto;
    margin-right: 20px;
    height: 20px;
    width: 20px;
    * {
      stroke: ${COLORS.CONFIRM};
      stroke-width: 4px;
    }
  }
`;
const OptionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 0;
  margin: 0;
  margin-top: 5px;
  height: fit-content;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  z-index: 100;
`;
const Options = styled.span`
  cursor: pointer;
  display: flex;
  margin: 0;
  color: ${COLORS.CONFIRM};
  font-size: 16px;
  padding: 0;
  padding: 10px 0;
  width: 100%;
  span {
    margin: 0;
    margin-left: 20px;
  }
  @media (hover: hover) {
    :hover {
      background-color: rgba(45, 155, 219, 0.1);
    }
  }
  &.selected {
    font-weight: 600;
    svg {
      margin-left: auto;
      margin-right: 20px;
      height: 20px;
      width: 20px;
      * {
        stroke: ${COLORS.CONFIRM};
        stroke-width: 4px;
      }
    }
  }
`;

interface Props {
  title: string;
  className?: string;
  options: string[];
}
const FilterBar = ({ title, options, ...rest }: Props) => {
  const DEFAULT_SELECTED = "Default";
  const [selected, setSelected] = useState<string>(DEFAULT_SELECTED);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkIfClickedOutside = (element: MouseEvent) => {
      if (
        showOptions &&
        ref.current &&
        !ref.current.contains(element.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside, true);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside, true);
    };
  }, [showOptions]);

  return (
    <FilterBarContainer {...rest} ref={ref}>
      <Header>{title}</Header>
      <SelectContainer onClick={() => setShowOptions(!showOptions)}>
        <span>{showOptions ? "Select Option" : selected}</span>
        {showOptions ? "" : <CheckIcon />}
      </SelectContainer>
      {showOptions && (
        <OptionsContainer className="options-container">
          {options.map((element, index) => (
            <Options
              key={index}
              className={selected === element ? "selected options" : "options"}
              onClick={() => {
                setShowOptions(!showOptions);
                setSelected(element);
              }}
            >
              <span>{element}</span>
              {selected === element ? <CheckIcon /> : ""}
            </Options>
          ))}
        </OptionsContainer>
      )}
    </FilterBarContainer>
  );
};

export default FilterBar;
