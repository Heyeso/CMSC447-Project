import React, { Suspense } from "react";
import styled from "styled-components";

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
}
function Main({ setCurrentRoute }: Props) {
  return (
    <>
      {/* TODO: Map Goes here */}
      <DataCardsContainer>
        <Suspense fallback={<div>loading</div>}>
          <DataCardView
            title="Test Card"
            onClick={() => {
              setCurrentRoute("Test Card");
            }}
          >
            Test Graph
          </DataCardView>
        </Suspense>
      </DataCardsContainer>
    </>
  );
}

export default Main;
