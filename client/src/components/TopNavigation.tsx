import React from "react";
import styled from "styled-components";
import { COLORS } from "../utils/constants";
import { ReactComponent as MenuIcon } from "./../assets/menu.icon.svg";
import { ReactComponent as NextIcon } from "./../assets/next.icon.svg";
import { Link } from "react-router-dom";
import { QuickViewDM } from "../utils/models";

const TopNavigationContainer = styled.nav`
  position: fixed;
  max-height: 90px;
  top: 0px;
  left: 0px;
  right: 18px;
  height: 100%;
  box-sizing: border-box;
  padding: 0 4.5vw;
  display: flex;
  align-items: center;
  z-index: 2000;
  transition: max-height 0.3s ease-out;

  &.not-top {
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(3px);
    max-height: 70px;
    transition: max-height 0.3s ease-out;

    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000;
    transform: translate3d(0, 0, 0);
    transform: translateZ(0);
  }

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
const Title = styled(Link)`
  position: relative;
  margin: 0 10px;
  font-size: 36px;
  height: 55px;
  cursor: pointer;
  display: flex;
  text-decoration: none;
  color: ${COLORS.BLACK};
  font-family: serif, sans-serif;
  &::after {
    content: "Crime Data";
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.5px;
    position: absolute;
    top: 35px;
    font-family: "Montserrat", sans-serif;
    right: 0;
  }
  @media (hover: hover) {
    :hover {
      color: ${COLORS.CONFIRM};
    }
  }
`;
const RouteContainer = styled.span`
  display: flex;
  align-items: center;
  margin: 0 5px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.3px;
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
  route: string;
  setFilterBarOpen: (value: boolean) => void;
  setCurrentRoute: (value: string) => void;
  setRouteData: (value: QuickViewDM | null) => void;
  onTop: boolean;
}

function TopNavigation({
  route,
  setFilterBarOpen,
  setCurrentRoute,
  setRouteData,
  onTop,
}: Props) {
  return (
    <TopNavigationContainer className={onTop ? "" : "not-top"}>
      <TitleContainer>
        <Title
          className="title"
          to="/"
          onClick={() => {
            setCurrentRoute("");
            setRouteData(null);
          }}
        >
          Baltimore
        </Title>
        {route !== "" && (
          <RouteContainer>
            <NextIcon /> {route}
          </RouteContainer>
        )}
      </TitleContainer>
      {route === "" && (
        <MenuIcon id="filter-icon" onClick={() => setFilterBarOpen(true)} />
      )}
    </TopNavigationContainer>
  );
}

export default TopNavigation;
