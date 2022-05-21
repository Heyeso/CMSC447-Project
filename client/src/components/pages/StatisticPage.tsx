import React, { Suspense, useState } from "react";
import styled, { keyframes } from "styled-components";
import Buttons from "../../reusable/Buttons";
import {
  ButtonTags,
  COLORS,
  getCardTitle,
  getGraphTag,
} from "../../utils/constants";
import { QuickViewDM } from "../../utils/models";
import { ReactComponent as CheckIcon } from "./../../assets/check.icon.svg";

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
  position: relative;
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
const SubTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  width: 90vw;
  margin: 50px 0 0;
  padding: 0;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  height: 35px;
  span {
    height: 20px;
    border-left: 2px solid ${COLORS.CONFIRM};
    margin-right: 10px;
  }
`;
const FilterContainer = styled.div`
  display: flex;
  margin: 40px 0 100px;
  flex-wrap: wrap;
  width: 90vw;
  height: fit-content;
`;
const FilterOption = styled.span`
  cursor: pointer;
  margin: 5px 10px;
  font-size: 14px;
  font-weight: 500;
  border: 1.8px solid ${COLORS.BLACK};
  box-sizing: border-box;
  border-radius: 5px;
  padding: 5px 7px;
  display: flex;
  align-items: center;
  &.new {
    border: 2px solid ${COLORS.CONFIRM};
    color: ${COLORS.CONFIRM};
    svg {
      margin-left: 10px;
      height: 17px;
      width: 17px;
      * {
        stroke: ${COLORS.CONFIRM};
        stroke-width: 4px;
      }
    }
  }
  &.current {
    border: 2px solid ${COLORS.CANCEL};
    color: ${COLORS.CANCEL};
  }
  @media (hover: hover) {
    &.non:hover {
      border: 1.8px solid ${COLORS.CONFIRM};
      color: ${COLORS.WHITE};
      background-color: ${COLORS.CONFIRM};
    }
  }
`;

interface Props {
  data: QuickViewDM | null;
}
function StatisticPage({ data }: Props) {
  const [filter, setFilter] = useState({ current: "", new: "" });

  return (
    <Container>
      <Title>
        <span></span>
        {data ? getCardTitle(data.title) : "Loading..."}
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
        {data ? "" : <Loading />}
      </GraphContainer>
      <SubTitle>
        <span></span>
        Graphs Filter Options
        {filter.new !== filter.current && (
          <Buttons
            tag={ButtonTags.CONFIRM}
            margin="0 30px"
            padding="5px 15px"
            borderRadius="5px"
            onClick={() => {
              setFilter({ ...filter, current: filter.new });
            }}
          >
            Apply Filter
          </Buttons>
        )}
      </SubTitle>
      <FilterContainer>
        {data &&
          data.data.map((element, index) => (
            <FilterOption
              key={index}
              onClick={() =>
                filter.new === element.type
                  ? setFilter({ ...filter, new: filter.current })
                  : setFilter({ ...filter, new: element.type })
              }
              className={
                filter.new === element.type
                  ? "new"
                  : filter.current === element.type
                  ? "current"
                  : "non"
              }
            >
              {element.type}
              {filter.new === element.type && <CheckIcon />}
            </FilterOption>
          ))}
      </FilterContainer>
    </Container>
  );
}

export default StatisticPage;

const LoadingAnim = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const CardLoadingAnim = keyframes`
  0% {
    background-color: ${COLORS.GRAY6};
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: ${COLORS.GRAY6};
  }
`;
const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2000;
  animation: ${CardLoadingAnim} 1.5s ease-in-out infinite;
  width: 100%;
  height: 100%;
  font-size: 30px;
  ::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -30px;
    margin-left: -30px;
    width: 50px;
    height: 50px;
    border-radius: 50px;
    border: 5px solid ${COLORS.WHITE};
    border-top-color: ${COLORS.CONFIRM};
    z-index: 2001;
    animation: ${LoadingAnim} 2s linear infinite;
  }
`;

const Loading = () => {
  return <LoadingContainer />;
};
