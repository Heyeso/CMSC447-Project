import React, { useState } from "react";
import styled from "styled-components";
import FilterData from "./components/FilterData";
import TopNav from "./components/TopNavigation";
import { COLORS } from "./utils/constants";

const Container = styled.div`
  position: relative;
  background-color: ${COLORS.WHITE};
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
`;

function App() {
  const [filterBarOpen, setFilterBarOpen] = useState<boolean>(false);

  return (
    <Container className="App">
      <TopNav routes={[]} setFilterBarOpen={setFilterBarOpen} />
      {filterBarOpen && <FilterData setFilterBarOpen={setFilterBarOpen} />}
    </Container>
  );
}

export default App;
