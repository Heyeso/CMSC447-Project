import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import styled from "styled-components";
import FilterData from "./components/FilterData";
import TopNav from "./components/TopNavigation";
import { COLORS, getEndpoint } from "./utils/constants";
import MainPage from "./components/Main";
import StatisticPage from "./components/pages/StatisticPage";
import { QuickViewDM, MapDataVM } from "./utils/models";

const Container = styled.div`
  position: relative;
  background-color: ${COLORS.BACKGROUND};
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
  padding-top: 90px;
  box-sizing: border-box;
`;

function App() {
  const [filterBarOpen, setFilterBarOpen] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>("");
  const [routeData, setRouteData] = useState<QuickViewDM | null>(null);
  const [onTop, setOnTop] = useState<boolean>(true);
  const [data, setData] = useState<QuickViewDM[] | null>(null);
  const [mapData, setMapData] = useState<MapDataVM[] | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    const url = location.pathname !== undefined ? location.pathname : "";
    const path = getEndpoint(url);
    if (path !== "") {
      fetch(`http://localhost:5000${path}`)
        .then((response) => response.json())
        .then((res_data) => {
          return setRouteData(res_data);
        })
        .catch((err) => console.log(err));
      setCurrentRoute(
        decodeURIComponent(url.substring(url.lastIndexOf("/") + 1))
      );
    }
  }, []);
  useEffect(() => {
    console.log(filters.join("&"));
  }, [filters]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (e.currentTarget.scrollTop === 0) setOnTop(true);
    else setOnTop(false);
  };

  return (
    <Container className="App">
      <TopNav
        route={currentRoute}
        setFilterBarOpen={setFilterBarOpen}
        setCurrentRoute={setCurrentRoute}
        setRouteData={setRouteData}
        onTop={onTop}
      />
      {filterBarOpen && (
        <FilterData
          data={data}
          setFilterBarOpen={setFilterBarOpen}
          setFilters={setFilters}
          filters={filters}
        />
      )}
      <MainPageContainer onScroll={handleScroll}>
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                setData={setData}
                data={data}
                setMapData={setMapData}
                mapData={mapData}
                setCurrentRoute={setCurrentRoute}
                setRouteData={setRouteData}
              />
            }
          />
          <Route
            path={`/statistic/${encodeURIComponent(currentRoute)}`}
            element={<StatisticPage data={routeData} />}
          />
        </Routes>
      </MainPageContainer>
    </Container>
  );
}

export default App;
