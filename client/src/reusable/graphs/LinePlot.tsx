import React from "react";
import { Line } from "@ant-design/plots";
import { COLORS, GraphDM } from "../../utils/constants";

interface Props {
  data: GraphDM[];
  width?: number;
  height?: number;
  color?: string;
  showLabel?: boolean;
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
  };

  return <Line {...config} {...rest} />;
};

export default LinePlot;
