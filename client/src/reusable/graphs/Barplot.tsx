import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Bar } from "@ant-design/plots";
import { GraphDM } from "../../utils/constants";

interface Props {
  data: GraphDM[];
  barWidthRatio?: number;
  width?: number;
  height?: number;
  color?: string;
}

const BarPlot = ({ data, barWidthRatio, ...rest }: Props) => {
  const config = {
    data,
    xField: "value",
    yField: "type",
    barWidthRatio: barWidthRatio ? barWidthRatio : 0.4,
  };
  return <Bar {...config} {...rest} />;
};

export default BarPlot;
