import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import Graphs from "../reusable/Graph";
import { COLORS, GraphTags, getGraphTag } from "../utils/constants";
import { QuickViewDM } from "../utils/models";
import { useNavigate } from "react-router-dom";

const DataCardView = React.lazy(() => import("../reusable/DataCardView"));
const DataCardsContainer = styled.section`
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
interface Props {
  setCurrentRoute: (value: string) => void;
  setRouteData: (value: QuickViewDM) => void;
}
function Main({ setCurrentRoute, setRouteData }: Props) {
  const [data, setData] = useState<QuickViewDM[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/crimes/statistics")
      .then((response) => response.json())
      .then((res_data) => {
        console.log(res_data);
        return setData(res_data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {/* TODO: Map Goes here */}
      <DataCardsContainer>
        {data &&
          data.map((element, index) => (
            <Suspense fallback={<div>loading</div>} key={index}>
              <DataCardView
                key={index}
                title={element.title}
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
                  height={280}
                  width={280}
                />
              </DataCardView>
            </Suspense>
          ))}
      </DataCardsContainer>
    </>
  );
}

export default Main;
