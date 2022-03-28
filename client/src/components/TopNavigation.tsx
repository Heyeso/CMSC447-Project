import React from "react";
import styled from "styled-components";
import { COLORS } from "../utils/constants";
import { ReactComponent as MenuIcon } from "./../assets/menu.icon.svg";
import { ReactComponent as Logo } from "./../assets/logo.icon.svg";
import { ReactComponent as NextIcon } from "./../assets/next.icon.svg";

const TopNavigationContainer = styled.nav`
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: ${COLORS.WHITE};
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 0 40px;
  display: flex;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  align-items: center;
  #filter-icon {
    margin: 0;
    margin-left: auto;
    height: 25px;
    width: 25px;
    cursor: pointer;
    * {
      stroke-width: 2.5px;
    }
    @media (hover: hover) {
      :hover {
        * {
          stroke: ${COLORS.CONFIRM};
          stroke-width: 3px;
        }
      }
    }
  }
`;
const TitleContainer = styled.div`
  display: flex;
  height: fit-content;
  width: fit-content;
  align-items: center;
`;
const Title = styled.h1`
  margin: 0 10px;
  font-size: 18px;
  font-weight: 600;
  height: fit-content;
  cursor: pointer;
  display: flex;
  align-items: center;
  @media (hover: hover) {
    :hover {
      color: ${COLORS.CONFIRM};
    }
  }
  svg {
    margin-right: 10px;
    height: 35px;
    width: 35px;
  }
`;
const Routes = styled.span`
  display: flex;
  align-items: center;
  margin: 0 5px;
  font-size: 14px;
  font-weight: 500;
  &.prev {
    cursor: pointer;
  }
  svg {
    height: 25px;
    width: 25px;
  }
  @media (hover: hover) {
    &.prev:hover {
      color: ${COLORS.CONFIRM};
      svg {
        * {
          stroke: ${COLORS.CONFIRM};
        }
      }
    }
  }
`;

interface Props {
  routes: string[];
  filterBarOpen: boolean;
  setFilterBarOpen: (value: boolean) => void;
}

function TopNavigation({ routes, filterBarOpen, setFilterBarOpen }: Props) {
  return (
    <TopNavigationContainer>
      <TitleContainer>
        <Title>
          <Logo />
          Baltimore Crime Data
        </Title>
        {routes.map((element, index) => (
          <Routes
            key={index}
            className={index === routes.length - 1 ? "" : "prev"}
          >
            <NextIcon /> {element}
          </Routes>
        ))}
      </TitleContainer>
      <MenuIcon
        id="filter-icon"
        onClick={() => setFilterBarOpen(!filterBarOpen)}
      />
    </TopNavigationContainer>
  );
}

export default TopNavigation;
