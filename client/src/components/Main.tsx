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
import { ReactComponent as PinIcon } from "./../assets/pin.icon.svg";
import { ReactComponent as CrimeIcon } from "./../assets/crime.icon.svg";
import { ReactComponent as WeaponIcon } from "./../assets/weapon.icon.svg";

const DataCardView = React.lazy(() => import("../reusable/DataCardView"));

const DataCardsContainer = styled.section`
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const MapPopupContainer = styled(Popup)`
  font-family: "Montserrat", sans-serif;
  width: 280px;
  svg {
    height: 15px;
    width: 15px;
    margin-right: 10px;
  }
  .crime,
  .location,
  .weapon,
  .date,
  .geo,
  .code {
    margin: 0;
    margin-bottom: 7px;
    text-transform: capitalize;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  .geo {
    letter-spacing: 0.7px;
    margin-top: 30px;
    margin-bottom: 10px;
    font-size: 12px;
    span {
      margin-right: 7px;
    }
  }
  .code {
    span {
      color: ${COLORS.CONFIRM};
      margin-right: 5px;
    }
  }
  .location {
    letter-spacing: -0.2px;
    font-weight: 600;
    font-size: 16px;
  }
  .crime,
  .weapon {
    font-weight: 600;
    color: #707070;
  }
  .date {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 15px;
    font-weight: 600;
    flex-direction: column;
    div {
      &.time {
        font-size: 12px;
        letter-spacing: 0.5px;
      }
      margin-left: auto;
    }
  }
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
  filters: string[];
  // mapData: MapDataVM[] | null;
  // setMapData: (value: MapDataVM[] | null) => void;
}
function Main({
  setCurrentRoute,
  setRouteData,
  data,
  setData,
  filters,
}: Props) {
  const navigate = useNavigate();

  const [mapData, setMapData] = useState<MapDataVM[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/crimes/statistics")
      .then((response) => response.json())
      .then((res_data) => {
        return setData(res_data);
      })
      .catch((err) => console.log(err));
    fetch(
      `http://localhost:5000/api/crimes/map/filters?n=100&${filters.join("&")}`
    )
      .then((response) => {
        return response.json();
      })
      .then((res_data) => {
        return setMapData(res_data);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/crimes/map/filters?n=100&${filters.join("&")}`
    )
      .then((response) => {
        return response.json();
      })
      .then((res_data) => {
        return setMapData(res_data);
      });
  }, [filters]);

  return (
    <>
      <MapContainerJ
        center={[39.29, -76.61]}
        zoom={11.5}
        id="map"
        scrollWheelZoom={false}
      >
        <TileLayer url="https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=RfEVsKGPWIYyqvgh3ZtV" />

        {mapData &&
          mapData.map((element, index) => (
            <Marker
              key={index}
              position={[
                element.GeoLocation.Latitude,
                element.GeoLocation.Longitude,
              ]}
            >
              <MapPopupContainer>
                <div className="geo">
                  <PinIcon />
                  <span>{element.GeoLocation.Latitude}</span>
                  <span>{element.GeoLocation.Longitude}</span>
                </div>
                <div className="code">
                  <span>{element.CrimeCode}</span>... ..
                </div>
                <div className="location">
                  {element.Location.toLowerCase()},{" "}
                  {element.Neighborhood.toLowerCase()}
                </div>
                <div className="crime">
                  <CrimeIcon />
                  {element.Description.toLowerCase()}
                </div>

                <div className="weapon">
                  <WeaponIcon />
                  {element.Weapon.toLowerCase() === ""
                    ? "Unidentified Weapon"
                    : element.Weapon.replaceAll("_", " ").toLowerCase()}
                </div>
                <div className="date">
                  <div>{new Date(element.Date).toDateString()}</div>
                  <div className="time">
                    {new Date(element.Date).toLocaleTimeString()}
                  </div>
                </div>
              </MapPopupContainer>
            </Marker>
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
