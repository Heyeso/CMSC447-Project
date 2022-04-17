import React, { Suspense } from "react";
import styled from "styled-components";
import Graphs from "../reusable/Graph";
import { COLORS, GraphTags } from "../utils/constants";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

const DataCardView = React.lazy(() => import("../reusable/DataCardView"));
const DataCardsContainer = styled.section`
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
// TODO: Testing Data, to delete
const data2 = [
  {
    type: "121",
    value: 27,
  },
  {
    type: "122",
    value: 25,
  },
  {
    type: "123",
    value: 18,
  },
  {
    type: "124",
    value: 15,
  },
  {
    type: "125",
    value: 10,
  },
  {
    type: "126",
    value: 5,
  },
  {
    type: "127",
    value: 15,
  },
  {
    type: "128",
    value: 10,
  },
  {
    type: "129",
    value: 5,
  },
];
interface Props {
  setCurrentRoute: (value: string) => void;
}
function Main({ setCurrentRoute }: Props) {
  return (
    <>
      {/* TODO: Map Goes here */}

      <MapContainer center={[39.29, -76.61]} zoom={13} height={180} >
        <TileLayer
          //attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>

      <DataCardsContainer>
        {/* TODO: Testing Data Cards, to delete */}
        <Suspense fallback={<div>loading</div>}>
          <DataCardView
            title="Test Card"
            onClick={() => {
              setCurrentRoute("Test Card");
            }}
          >
            <Graphs
              data={data2}
              tag={GraphTags.LINE}
              height={280}
              width={280}
              color={COLORS.CONFIRM}
            />
          </DataCardView>
        </Suspense>
        {/* <Suspense fallback={<div>loading</div>}>
          <DataCardView
            title="Test Map"
            onClick={() => {
              setCurrentRoute("Test Map");
            }}
          >
            
          </DataCardView>
        </Suspense> */}
        <Suspense fallback={<div>loading</div>}>
          <DataCardView
            title="Test Card1"
            onClick={() => {
              setCurrentRoute("Test Card");
            }}
          >
            <Graphs
              data={data2}
              tag={GraphTags.BAR}
              height={280}
              width={280}
              color={COLORS.CONFIRM}
            />
          </DataCardView>
        </Suspense>
        <Suspense fallback={<div>loading</div>}>
          <DataCardView
            title="Test Card2"
            onClick={() => {
              setCurrentRoute("Test Card");
            }}
          >
            <Graphs data={data2} tag={GraphTags.PIE} height={280} width={280} />
          </DataCardView>
        </Suspense>
      </DataCardsContainer>
    </>
  );
}

export default Main;
