import React from "react";
import { Bar } from "@ant-design/plots";
import { GraphDM } from "../../utils/constants";

interface Props {
  data: GraphDM[];
  barWidthRatio?: number;
  width?: number;
  height?: number;
  color?: string;
  seriesField?: string;
  autoFit?: boolean;
}

const BarPlot = ({ data, barWidthRatio, ...rest }: Props) => {
  const config = {
    data,
    xField: "value",
    yField: "type",
    seriesField: "type",
    barWidthRatio: barWidthRatio ? barWidthRatio : 0.4,
  };
  return <Bar {...config} {...rest} />;
};

export default BarPlot;
