import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Buttons from "../reusable/Buttons";
import FilterBar from "../reusable/FilterBar";
import { QuickViewDM } from "../utils/models";
import { ButtonTags, COLORS } from "./../utils/constants";

const NullBackground = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 3000;
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
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
  filters: string[];
  data: QuickViewDM[] | null;
}
function FilterData({ setFilterBarOpen, setFilters, filters, data }: Props) {
  const [currentFilters, setCurrentFilters] = useState<string[]>(filters);
  useEffect(() => {
    console.log(currentFilters.join("&"));
  }, [currentFilters]);
  return (
    <NullBackground>
      <FilterDataContainer>
        <Title>Crime Data Filter</Title>
        <Content>
          {data?.map((element, index) => (
            <FilterBar
              key={index}
              title={element.title.replace(" Distribution", "")}
              options={element.data.map((item) => item.type)}
              filters={currentFilters}
              setFilters={setCurrentFilters}
            />
          ))}
        </Content>
        <Footer>
          <Buttons
            tag={ButtonTags.CONFIRM}
            margin="0px 5px"
            onClick={() => {
              // filters.join("&")
              setFilters(currentFilters);
              setFilterBarOpen(false);
            }}
          >
            Apply Changes
          </Buttons>
          <Buttons
            tag={ButtonTags.CANCEL}
            margin="0px 5px"
            onClick={() => {
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
