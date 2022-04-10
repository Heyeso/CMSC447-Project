import React from "react";
import styled from "styled-components";
import { GraphTags, GraphDM } from "../utils/constants";
import BarPlot from "./graphs/BarPlot";
import LinePlot from "./graphs/LinePlot";
import PieChart from "./graphs/PieChart";

const Container = styled.div``;
interface Props {
  data: GraphDM[];
  tag: GraphTags;
  barWidthRatio?: number;
  width?: number;
  height?: number;
  color?: string;
}
const Graphs = ({ data, tag, barWidthRatio,  ...rest }: Props) => {
  function GetGraph(graph: GraphTags) {
    switch (graph) {
      case GraphTags.PIE:
        return <PieChart data={data} {...rest} />;
      case GraphTags.BAR:
        return <BarPlot data={data} barWidthRatio={barWidthRatio} {...rest} />;
      case GraphTags.LINE:
        return <LinePlot data={data} {...rest} />;
      default:
        return <div>No Graph</div>;
    }
  }
  return <Container>{GetGraph(tag)}</Container>;
};

export default Graphs;
