import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
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
  margin-bottom: 25px;
`;
const Header = styled.h1`
  font-weight: 600;
  font-size: 12px;
  margin: 0 0 7px 0;
  letter-spacing: 0.3px;
  padding: 0;
  color: ${COLORS.BLACK};
  width: 100%;
  text-transform: uppercase;
`;
const SelectContainer = styled.div`
  cursor: pointer;
  width: 100%;
  height: 40px;
  border: 2px solid ${COLORS.CONFIRM};
  box-sizing: border-box;
  border-radius: 7px;
  display: flex;
  align-items: center;
  @media (hover: hover) {
    :hover {
      background-color: rgba(45, 155, 219, 0.1);
    }
  }
  span {
    margin: 0;
    margin-left: 14px;
    color: ${COLORS.CONFIRM};
    font-weight: 500;
    font-size: 14px;
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
  height: fit-content;
  padding: 0;
  margin: 0;
  margin-top: 5px;
  max-height: 50vh;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.WHITE};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  z-index: 100;
  overflow-y: auto;
  &.hide {
    visibility: hidden;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 500px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: rgba(45, 155, 219, 0.6);
    border-radius: 500px;
    opacity: 0.5;
    :hover {
      background-color: rgba(45, 155, 219, 0.7);
    }
  }
`;
const Options = styled.span`
  cursor: pointer;
  display: flex;
  margin: 0;
  color: ${COLORS.BLACK};
  font-size: 14px;
  padding: 0;
  padding: 7px 0;
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
    color: ${COLORS.CONFIRM};
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
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
}
const FilterBar = ({ title, options, setFilters, filters, ...rest }: Props) => {
  const DEFAULT_SELECTED = "All";
  const [selected, setSelected] = useState<string>(DEFAULT_SELECTED);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const ref = useRef<HTMLParagraphElement>(null);

  let controlContainerOverflow = (element: HTMLElement) => {
    if (element) {
      let bottom = element.getBoundingClientRect().bottom;
      if (window.innerHeight - bottom < 0) {
        element.style.top = `${window.innerHeight - bottom}px`;
      }
    }
  };
  useEffect(() => {
    let prev = filters.find((element) => element.includes(`${title}=`));
    setSelected(
      prev === undefined
        ? "All"
        : title === "Hour"
        ? prev.replace(`${title}=`, "")
        : decodeURIComponent(prev.replace(`${title}=`, ""))
    );
  }, []);
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
      <SelectContainer
        onClick={(e) => {
          let optionsContainer =
            e.currentTarget.parentNode?.querySelector(".options-container");
          if (optionsContainer)
            if (optionsContainer.classList.contains("hide"))
              controlContainerOverflow(optionsContainer as HTMLElement);
          setShowOptions(!showOptions);
        }}
      >
        <span>{showOptions ? "Select Option" : selected}</span>
        {showOptions ? "" : <CheckIcon />}
      </SelectContainer>
      <OptionsContainer
        className={showOptions ? "options-container" : "options-container hide"}
      >
        <Options
          key={0}
          className={selected === "All" ? "selected options" : "options"}
          onClick={() => {
            setShowOptions(!showOptions);
            setSelected("All");
            setFilters(filters.filter((item) => !item.includes(`${title}=`)));
          }}
        >
          <span>All</span>
          {selected === "All" ? <CheckIcon /> : ""}
        </Options>
        {options.map((element, index) => (
          <Options
            key={index + 1}
            className={selected === element ? "selected options" : "options"}
            onClick={() => {
              setShowOptions(!showOptions);
              setSelected(element);
              if (
                filters.includes(
                  `${title}=${
                    title !== "Hour" ? encodeURIComponent(element) : element
                  }`
                )
              )
                return;
              else {
                return setFilters([
                  ...filters.filter((item) => !item.includes(`${title}=`)),
                  `${title}=${
                    title !== "Hour" ? encodeURIComponent(element) : element
                  }`,
                ]);
              }
            }}
          >
            <span>{element}</span>
            {selected === element ? <CheckIcon /> : ""}
          </Options>
        ))}
      </OptionsContainer>
    </FilterBarContainer>
  );
};

export default FilterBar;
