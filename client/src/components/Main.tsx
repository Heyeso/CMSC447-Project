import React, { Suspense } from "react";
import styled from "styled-components";
import Graphs from "../reusable/Graph";
import { COLORS, GraphTags } from "../utils/constants";

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
