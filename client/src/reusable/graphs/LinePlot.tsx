import React from "react";
import { Line } from "@ant-design/plots";
import { COLORS, GraphDM } from "../../utils/constants";

interface Props {
  data: GraphDM[];
  width?: number;
  height?: number;
  color?: string;
  showLabel?: boolean;
}

const LinePlot = ({ data, showLabel, ...rest }: Props) => {
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
      label:
        showLabel && data.length < 20
          ? {
              rotate: data.length > 5 ? 0.5 : 0,
            }
          : null,
    },
  };

  return <Line {...config} {...rest} />;
};

export default LinePlot;
