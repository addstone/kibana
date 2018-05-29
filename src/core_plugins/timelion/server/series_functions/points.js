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

import alter from '../lib/alter.js';
import _ from 'lodash';
import Chainable from '../lib/classes/chainable';

const validSymbols = ['triangle', 'cross', 'square', 'diamond', 'circle'];
const defaultSymbol = 'circle';

export default new Chainable('points', {
  args: [
    {
      name: 'inputSeries',
      types: ['seriesList']
    },
    {
      name: 'radius',
      types: ['number', 'null'],
      help: 'Size of points'
    },
    {
      name: 'weight',
      types: ['number', 'null'],
      help: 'Thickness of line around point'
    },
    {
      name: 'fill',
      types: ['number', 'null'],
      help: 'Number between 0 and 10 representing opacity of fill'
    },
    {
      name: 'fillColor',
      types: ['string', 'null'],
      help: 'Color with which to fill point'
    },
    {
      name: 'symbol',
      help: `point symbol. One of: ${validSymbols.join(', ')}`,
      types: ['string', 'null'],
      suggestions: validSymbols.map(symbol => {
        const suggestion = { name: symbol };
        if (symbol === defaultSymbol) {
          suggestion.help = 'default';
        }
        return suggestion;
      })
    },
    {
      name: 'show',
      types: ['boolean', 'null'],
      help: 'Show points or not'
    }
  ],
  help: 'Show the series as points',
  fn: function pointsFn(args) {
    return alter(args, function (eachSeries, radius, weight, fill, fillColor, symbol, show) {
      eachSeries.points = eachSeries.points || {};
      eachSeries.points.radius = radius == null ? undefined : radius;

      if (fill) {
        eachSeries.points.fillColor = fillColor == null ? false : fillColor;
      }

      if (fill != null) {
        eachSeries.points.fill =  fill / 10;
      }

      if (weight != null) {
        eachSeries.points.lineWidth = weight;
      }

      symbol = symbol || defaultSymbol;
      if (!_.contains(validSymbols, symbol)) {
        throw new Error('Valid symbols are: ' + validSymbols.join(', '));
      }

      eachSeries.points.symbol = symbol;

      eachSeries.points.show = show == null ? true : show;



      return eachSeries;
    });
  }
});
