import React from "react";
import { Pie } from "@ant-design/plots";
import { GraphDM } from "../../utils/constants";

interface Props {
  data: GraphDM[];
  width?: number;
  height?: number;
  color?: string;
  autoFit?: boolean;
}
const PieChart = ({ data, ...rest }: Props) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.75,
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name}\n{percentage}",
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
  };
  return <Pie {...config} {...rest}/>;
};
export default PieChart;
