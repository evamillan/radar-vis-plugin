/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * Bitergia requires contributions made to this file be 
 * licensed under the Apache-2.0 license or a compatible
 * open source license.
 *
 * Any modifications Copyright Bitergia.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useRef } from 'react';
import { Radar } from 'react-chartjs-2';
import { euiPaletteColorBlindBehindText } from '@elastic/eui';

export const RadarVis = ({ visData, visParams }) => {
  const colorPalette = euiPaletteColorBlindBehindText({rotations: 2});
  const normalizeData = visParams.normalize;
  const vertexMaxScale = visParams.vertexScaleTo;
  const chartRef = useRef(null);
  
  function normalize(val: number, max: number, min: number, scale: number) {
    return (scale * (val - min) / (max - min))
  };

  const getData = () => {
    const customLabels = visData.aggs.bySchemaName('vertex').map(metric => metric.params.customLabel || metric.type.title)
    const metricIds = visData.aggs.bySchemaName('vertex').map(metric => metric.id)

    const valuesMetrics = {}
    for (let index = 0; index < visData.tables[0].rows.length; index++) {
      const bucket = visData.tables[0].rows[index];
      for (let i = 0; i < metricIds.length; i++) {
        if (!valuesMetrics[i + 1]) {
          valuesMetrics[i + 1] = []
        }
        let k = i + 1
        //Pick metric if exist
        if (bucket['col-' + k + '-' + metricIds[i]]) {
          valuesMetrics[i + 1].push(bucket['col-' + k + '-' + metricIds[i]])
        }
      }
    }
    
    const dataParsed = [];
    for (let index = 0; index < visData.tables[0].rows.length; index++) {
      const bucket = visData.tables[0].rows[index];
      const valuesBucket = []
      const originWithoutNormalize = []
      const label = bucket['col-0-' + visData.aggs.bySchemaName('field')[0]?.id] || '';
      for (let index = 1; index < Object.keys(bucket).length; index++) {
        if (normalizeData && valuesMetrics[index]) {
          let normMin = 1;
          let normMax = Math.max(...valuesMetrics[index]);

          if (visParams['rangesMetrics_' + (index - 1) + '_from']) {
            normMin = visParams['rangesMetrics_' + (index - 1) + '_from'];
          }
          if (visParams['rangesMetrics_' + (index - 1) + '_to']) {
            normMax = visParams['rangesMetrics_' + (index - 1) + '_to'];
          }
          // Just pick the metric if exist
          if (bucket['col-' + index + '-' + metricIds[index - 1]]) {
            valuesBucket.push(normalize(bucket['col-' + index + '-' + metricIds[index - 1]], normMax, normMin, vertexMaxScale))
          }
        } else {
          // Just pick the metric if exist
          if (bucket['col-' + index + '-' + metricIds[index - 1]]) {
            valuesBucket.push(bucket['col-' + index + '-' + metricIds[index - 1]]);
          }
        }
        // Just pick the metric if exist
        if (bucket['col-' + index + '-' + metricIds[index - 1]]) {
          originWithoutNormalize.push(bucket['col-' + index + '-' + metricIds[index - 1]]);
        }
      }
      // Border color must have a complete alpha
      const borderColor = colorPalette[index];
      const bucketArea = {
        label: label,
        data: valuesBucket,
        dataOrig: originWithoutNormalize,
        backgroundColor: `${borderColor}30`,
        borderColor: borderColor,
        pointBackgroundColor: borderColor,
        pointBorderColor: "#fff"
      };
      dataParsed.push(bucketArea)
    }
    return {
      datasets: dataParsed,
      labels: customLabels
    }
  };  

  const getLabel = (tooltipItem, data) => {
    const dataset = data['datasets'][tooltipItem['datasetIndex']];
    const value = dataset['data'][tooltipItem['index']];
    const labelsWithSameValue = [];
    for (let i = 0; i < data['datasets'].length; i++) {
      const e = data['datasets'][i];
      const v = e['data'][tooltipItem['index']];
      if (v == value) {
        labelsWithSameValue.push(e.label)
      }
    }

    var str = "";
    for (let index = 0; index < labelsWithSameValue.length; index++) {
      const element = labelsWithSameValue[index];
      if (index == labelsWithSameValue.length - 1) {
        str += element;
        continue
       }
      str += element + ", "
    }
    return `${str}: ${value}`;
  }

  const getOptions = () => {
    const options = {
      responsive: true,
      maintainAspectRadio: false,
      scale: {
        reverse: false,
        ticks: {
          beginAtZero: true,
          min: 0
        },
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => getLabel(tooltipItem, data)
        },
        backgroundColor: '#0A121A',
        titleFontSize: 16,
        titleFontColor: '#FFF',
        bodyFontColor: '#FFF',
        bodyFontSize: 14,
        displayColors: false
      }
    };
    if (normalizeData) {
      Object.assign(options.scale.ticks, { max: vertexMaxScale });
      Object.assign(options.tooltips.callbacks, {
        label: (tooltipItem, data) => getLabel(tooltipItem, data),
        afterLabel: function (tooltipItem, data) {
          const dataset = data['datasets'][tooltipItem['datasetIndex']];
          const value = dataset['data'][tooltipItem['index']];
          return `Normalizated value: ${value}`;
        }
      })
    }
    return options;
  }

  const chartData = getData();
  const chartOptions = getOptions();

  return (
    <Radar
      ref={chartRef}
      data={chartData}
      options={chartOptions}
    />
  )
};