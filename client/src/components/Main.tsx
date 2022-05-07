import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import Graphs from "../reusable/Graph";
import {
  COLORS,
  GraphTags,
  getGraphTag,
  getCardTitle,
} from "../utils/constants";
import { QuickViewDM, MapDataVM } from "../utils/models";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const DataCardView = React.lazy(() => import("../reusable/DataCardView"));

const DataCardsContainer = styled.section`
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const MapContainerJ = styled(MapContainer)`
  width: 97%;
  height: 80vh;
  margin: 40px auto;
`;
interface Props {
  setCurrentRoute: (value: string) => void;
  setRouteData: (value: QuickViewDM) => void;
  data: QuickViewDM[] | null;
  setData: (value: QuickViewDM[] | null) => void;
  mapData: MapDataVM[] | null;
  setMapData: (value: MapDataVM[] | null) => void;
}
function Main({ setCurrentRoute, setRouteData, data, setData, mapData, setMapData }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/crimes/statistics")
      .then((response) => response.json())
      .then((res_data) => {
        return setData(res_data);
      })
      .catch((err) => console.log(err));
    fetch("http://localhose:5000/api/crimes/map/filters")
      .then((response) => response.json())
      .then((res_data) => {
        return setMapData(res_data);
      })
  }, []);

  return (
    <>
      <MapContainerJ
        center={[39.29, -76.61]}
        zoom={11.5}
        id="map"
        scrollWheelZoom={false}
      >
        <TileLayer url="https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=RfEVsKGPWIYyqvgh3ZtV" />
        <Marker position={[39.29, -76.61]}>
          <Popup>Sample Marker</Popup>
        </Marker>
        {mapData &&
          mapData.map((element, index) => (
            <Marker position={[element.GeoLocation.Lattitude, element.GeoLocation.Longitude]}></Marker>
        ))}
      </MapContainerJ>

      <DataCardsContainer>
        {data &&
          data.map((element, index) => (
            <Suspense fallback={<div>loading</div>} key={index}>
              <DataCardView
                key={index}
                title={getCardTitle(element.title)}
                onClick={() => {
                  setCurrentRoute(element.title);
                  setRouteData(element);
                  navigate(`/statistic/${encodeURIComponent(element.title)}`);
                }}
                className="quick-view"
              >
                <Graphs
                  data={element.data}
                  tag={getGraphTag(element.tag)}
                  height={300}
                  width={300}
                  color={COLORS.CONFIRM}
                />
              </DataCardView>
            </Suspense>
          ))}
      </DataCardsContainer>
    </>
  );
}

export default Main;
