import React, { useState } from "react";
import styled from "styled-components";
import Buttons from "../reusable/Buttons";
import FilterBar from "../reusable/FilterBar";
import { ButtonTags, COLORS } from "./../utils/constants";

const NullBackground = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 100;
`;
const FilterDataContainer = styled.nav`
  background-color: ${COLORS.WHITE};
  box-sizing: border-box;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100%;
  background: ${COLORS.WHITE};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;
const Title = styled.header`
  font-weight: 600;
  font-size: 20px;
  line-height: 48px;
  letter-spacing: -0.5px;
`;

const Content = styled.main`
  margin: 30px 0;
`;
const Footer = styled.footer`
  margin: 0;
  margin-top: auto;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;
interface Props {
  setFilterBarOpen: (value: boolean) => void;
}
function FilterData({ setFilterBarOpen }: Props) {
  return (
    <NullBackground>
      <FilterDataContainer>
        <Title>Crime Data Filter</Title>
        <Content>{/* TODO:Filter Options Here */}</Content>
        <Footer>
          <Buttons
            tag={ButtonTags.CONFIRM}
            margin="0px 5px"
            onClick={() => {
              {
                /* TODO:Apply and Reset Filters on Apply changes */
              }
              setFilterBarOpen(false);
            }}
          >
            Apply Changes
          </Buttons>
          <Buttons
            tag={ButtonTags.CANCEL}
            margin="0px 5px"
            onClick={() => {
              {
                /* TODO:Reset Filters on Cancel */
              }
              setFilterBarOpen(false);
            }}
          >
            Cancel
          </Buttons>
        </Footer>
      </FilterDataContainer>
    </NullBackground>
  );
}

export default FilterData;
