import React from "react";
import { Line } from "@ant-design/plots";
import { COLORS, GraphDM } from "../../utils/constants";

interface Props {
  data: GraphDM[];
  width?: number;
  height?: number;
  color?: string;
  autoFit?: boolean;
}

const LinePlot = ({ data, ...rest }: Props) => {
  const config = {
    data,
    xField: "type",
    yField: "value",
    point: {
      size: 3,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: COLORS.CONFIRM,
        lineWidth: 2,
      },
    },
    xAxis: {
      label: {
        rotate: data.length > 5 ? 0.5 : 0,
      },
    },
  };

  return <Line {...config} {...rest} />;
};

export default LinePlot;
