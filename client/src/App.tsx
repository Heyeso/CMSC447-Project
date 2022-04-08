import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import FilterData from "./components/FilterData";
import TopNav from "./components/TopNavigation";
import { COLORS } from "./utils/constants";
import MainPage from "./components/Main";

const Container = styled.div`
  position: relative;
  background-color: ${COLORS.WHITE};
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0;
`;

const MainPageContainer = styled.main`
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 15px 10px;
  padding-top: 70px;
  box-sizing: border-box;
`;

function App() {
  const [filterBarOpen, setFilterBarOpen] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>("");

  return (
    <Container className="App">
      <TopNav route={currentRoute} setFilterBarOpen={setFilterBarOpen} />
      {filterBarOpen && <FilterData setFilterBarOpen={setFilterBarOpen} />}
      <MainPageContainer>
        <Routes>
          <Route
            path="/"
            element={<MainPage setCurrentRoute={setCurrentRoute} />}
          />
        </Routes>
      </MainPageContainer>
    </Container>
  );
}

export default App;
