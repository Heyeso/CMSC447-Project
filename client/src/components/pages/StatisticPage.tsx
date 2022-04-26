import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import { COLORS, getCardTitle, getGraphTag } from "../../utils/constants";
import { QuickViewDM } from "../../utils/models";

const Graphs = React.lazy(() => import("../../reusable/Graph"));
const Container = styled.section`
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: ${COLORS.BLACK};
`;
const GraphContainer = styled.div`
  margin: 5px 5px 20px;
  padding: 15px;
  width: 90vw;
  height: 600px;
`;
const Title = styled.header`
  font-weight: 600;
  font-size: 16px;
  width: 90vw;
  margin: 70px 0 50px;
  padding: 0;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  span {
    height: 25px;
    border-left: 2px solid ${COLORS.CONFIRM};
    margin-right: 10px;
  }
`;

interface Props {
  data: QuickViewDM | null;
}
function StatisticPage({ data }: Props) {
  return (
    <Container>
      <Title>
        <span></span>
        {getCardTitle(data ? data.title : "")}
      </Title>
      <GraphContainer>
        {data && (
          <Suspense fallback={<Loading />}>
            {data && (
              <Graphs
                data={data.data}
                tag={getGraphTag(data.tag)}
                height={600}
                seriesField={"type"}
                barWidthRatio={0.6}
              />
            )}
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
