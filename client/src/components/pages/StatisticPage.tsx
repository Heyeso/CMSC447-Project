import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { COLORS, getGraphTag } from "../../utils/constants";
import { QuickViewDM } from "../../utils/models";

const Graphs = React.lazy(() => import("../../reusable/Graph"));
const Container = styled.section`
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const GraphContainer = styled.div`
  margin: 5px 5px 20px;
  padding: 15px;
  width: 90vw;
  height: 600px;
`;

interface Props {
  data: QuickViewDM | null;
}
function StatisticPage({ data }: Props) {
  return (
    <Container>
      <GraphContainer>
        {data && (
          <Suspense fallback={<Loading />}>
            <Graphs
              data={data.data}
              tag={getGraphTag(data.tag)}
              height={600}
              seriesField={"type"}
              barWidthRatio={0.6}
            />
          </Suspense>
        )}
      </GraphContainer>
    </Container>
  );
}

export default StatisticPage;

const LoadingContainer = styled.div``;

const Loading = () => {
  return <LoadingContainer>loading</LoadingContainer>;
};
