import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';

const DemoPie = () => {
  const data = [
    {
      type: 'Weapons',
      value: 27,
    },
    {
      type: 'Neighborhood',
      value: 25,
    },
    {
      type: 'Time',
      value: 18,
    },
    {
      type: 'City',
      value: 15,
    },
    {
      type: 'Students',
      value: 10,
    },
    {
      type: 'Adults',
      value: 5,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};
export default DemoPie
