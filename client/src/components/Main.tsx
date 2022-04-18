import React, { Suspense } from "react";
import styled from "styled-components";
import Graphs from "../reusable/Graph";
import { COLORS, GraphTags } from "../utils/constants";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "./map.css";

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
    type: "2010-01",
    value: 1998,
  },
  {
    type: "2010-02",
    value: 1850,
  },
  {
    type: "2010-03",
    value: 1720,
  },
  {
    type: "2010-04",
    value: 1818,
  },
  {
    type: "2010-05",
    value: 1920,
  },
  {
    type: "2010-06",
    value: 1802,
  },
  {
    type: "2010-07",
    value: 1945,
  },
  {
    type: "2010-08",
    value: 1856,
  },
  {
    type: "2010-09",
    value: 2107,
  },
  {
    type: "2010-10",
    value: 2140,
  },
  {
    type: "2010-11",
    value: 2311,
  },
  {
    type: "2010-12",
    value: 1972,
  },
  {
    type: "2011-01",
    value: 1760,
  },
  {
    type: "2011-02",
    value: 1824,
  },
  {
    type: "2011-03",
    value: 1801,
  },
  {
    type: "2011-04",
    value: 2001,
  },
  {
    type: "2011-05",
    value: 1640,
  },
  {
    type: "2011-06",
    value: 1502,
  },
  {
    type: "2011-07",
    value: 1621,
  },
  {
    type: "2011-08",
    value: 1480,
  },
  {
    type: "2011-09",
    value: 1549,
  },
  {
    type: "2011-10",
    value: 1390,
  },
  {
    type: "2011-11",
    value: 1325,
  },
  {
    type: "2011-12",
    value: 1250,
  },
  {
    type: "2012-01",
    value: 1394,
  },
  {
    type: "2012-02",
    value: 1406,
  },
  {
    type: "2012-03",
    value: 1578,
  },
  {
    type: "2012-04",
    value: 1465,
  },
  {
    type: "2012-05",
    value: 1689,
  },
  {
    type: "2012-06",
    value: 1755,
  },
  {
    type: "2012-07",
    value: 1495,
  },
  {
    type: "2012-08",
    value: 1508,
  },
  {
    type: "2012-09",
    value: 1433,
  },
  {
    type: "2012-10",
    value: 1344,
  },
  {
    type: "2012-11",
    value: 1201,
  },
  {
    type: "2012-12",
    value: 1065,
  },
  {
    type: "2013-01",
    value: 1255,
  },
  {
    type: "2013-02",
    value: 1429,
  },
  {
    type: "2013-03",
    value: 1398,
  },
  {
    type: "2013-04",
    value: 1678,
  },
  {
    type: "2013-05",
    value: 1524,
  },
  {
    type: "2013-06",
    value: 1688,
  },
  {
    type: "2013-07",
    value: 1500,
  },
  {
    type: "2013-08",
    value: 1670,
  },
  {
    type: "2013-09",
    value: 1734,
  },
  {
    type: "2013-10",
    value: 1699,
  },
  {
    type: "2013-11",
    value: 1508,
  },
  {
    type: "2013-12",
    value: 1680,
  },
  {
    type: "2014-01",
    value: 1750,
  },
  {
    type: "2014-02",
    value: 1602,
  },
  {
    type: "2014-03",
    value: 1834,
  },
  {
    type: "2014-04",
    value: 1722,
  },
  {
    type: "2014-05",
    value: 1430,
  },
  {
    type: "2014-06",
    value: 1280,
  },
  {
    type: "2014-07",
    value: 1367,
  },
  {
    type: "2014-08",
    value: 1155,
  },
  {
    type: "2014-09",
    value: 1289,
  },
  {
    type: "2014-10",
    value: 1104,
  },
  {
    type: "2014-11",
    value: 1246,
  },
  {
    type: "2014-12",
    value: 1098,
  },
  {
    type: "2015-01",
    value: 1189,
  },
  {
    type: "2015-02",
    value: 1276,
  },
  {
    type: "2015-03",
    value: 1033,
  },
  {
    type: "2015-04",
    value: 956,
  },
  {
    type: "2015-05",
    value: 845,
  },
  {
    type: "2015-06",
    value: 1089,
  },
  {
    type: "2015-07",
    value: 944,
  },
  {
    type: "2015-08",
    value: 1043,
  },
  {
    type: "2015-09",
    value: 893,
  },
  {
    type: "2015-10",
    value: 840,
  },
  {
    type: "2015-11",
    value: 934,
  },
  {
    type: "2015-12",
    value: 810,
  },
  {
    type: "2016-01",
    value: 782,
  },
  {
    type: "2016-02",
    value: 1089,
  },
  {
    type: "2016-03",
    value: 745,
  },
  {
    type: "2016-04",
    value: 680,
  },
  {
    type: "2016-05",
    value: 802,
  },
  {
    type: "2016-06",
    value: 697,
  },
  {
    type: "2016-07",
    value: 583,
  },
  {
    type: "2016-08",
    value: 456,
  },
  {
    type: "2016-09",
    value: 524,
  },
  {
    type: "2016-10",
    value: 398,
  },
  {
    type: "2016-11",
    value: 278,
  },
  {
    type: "2016-12",
    value: 195,
  },
  {
    type: "2017-01",
    value: 145,
  },
  {
    type: "2017-02",
    value: 207,
  },
];
interface Props {
  setCurrentRoute: (value: string) => void;
}
function Main({ setCurrentRoute }: Props) {
  return (
    <>
      {/* TODO: Map Goes here */}

      {/* Not pretty, but gets the job done */}
      <MapContainer center={[39.29, -76.61]} zoom={13} height={300} >
        <TileLayer
          url='https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=RfEVsKGPWIYyqvgh3ZtV'
        />
        <Marker position={[39.29, -76.61]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Marker position={[39.19, -76.61]}>
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
              data={data2.slice(0, 30)}
              tag={GraphTags.LINE}
              showLabel={true}
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
            <MapContainer center={[39.29, -76.61]} zoom={13} height={300} >
              <TileLayer
                //attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[39.29, -76.61]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
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
              data={data2.slice(0, 10)}
              tag={GraphTags.BAR}
              height={280}
              width={280}
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
            <Graphs
              data={data2.slice(0, 10)}
              tag={GraphTags.PIE}
              height={280}
              width={280}
            />
          </DataCardView>
        </Suspense>
      </DataCardsContainer>
    </>
  );
}

export default Main;
