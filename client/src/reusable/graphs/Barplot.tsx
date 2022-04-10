import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Bar } from '@ant-design/plots';

const DemoBar = () => {
  const data = [
    {
      year: '2017',
      value: 38,
    },
    {
      year: '2018',
      value: 52,
    },
    {
      year: '2019',
      value: 61,
    },
    {
      year: '2020',
      value: 145,
    },
    {
      year: '2021',
      value: 48,
    },
  ];
  const config = {
    data,
    xField: 'value',
    yField: 'year',
    seriesField: 'year',
    legend: {
      position: 'top-left',
    },
  };
  return <Bar {...config} />;
};

export default DemoBar
