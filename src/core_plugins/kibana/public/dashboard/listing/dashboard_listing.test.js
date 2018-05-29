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

jest.mock('ui/notify',
  () => ({
    toastNotifications: {
      addWarning: () => {},
    }
  }), { virtual: true });

jest.mock('lodash',
  () => ({
    // mock debounce to fire immediately with no internal timer
    debounce: function (func) {
      function debounced(...args) {
        return func.apply(this, args);
      }
      return debounced;
    }
  }), { virtual: true });

import React from 'react';
import { shallow } from 'enzyme';

import {
  DashboardListing,
} from './dashboard_listing';

const find = (num) => {
  const hits = [];
  for (let i = 0; i < num; i++) {
    hits.push({
      id: `dashboard${i}`,
      title: `dashboard${i} title`,
      description: `dashboard${i} desc`
    });
  }
  return Promise.resolve({
    total: num,
    hits: hits
  });
};

test('renders table in loading state', () => {
  const component = shallow(<DashboardListing
    find={find.bind(null, 2)}
    delete={() => {}}
    listingLimit={1000}
    hideWriteControls={false}
  />);
  expect(component).toMatchSnapshot();
});

test('initialFilter', () => {
  const component = shallow(<DashboardListing
    find={find.bind(null, 2)}
    delete={() => {}}
    listingLimit={1000}
    hideWriteControls={false}
    initialFilter="my dashboard"
  />);
  expect(component).toMatchSnapshot();
});

describe('after fetch', () => {
  test('renders table rows', async () => {
    const component = shallow(<DashboardListing
      find={find.bind(null, 2)}
      delete={() => {}}
      listingLimit={1000}
      hideWriteControls={false}
    />);

    // Ensure all promises resolve
    await new Promise(resolve => process.nextTick(resolve));
    // Ensure the state changes are reflected
    component.update();

    expect(component).toMatchSnapshot();
  });

  test('renders call to action when no dashboards exist', async () => {
    const component = shallow(<DashboardListing
      find={find.bind(null, 0)}
      delete={() => {}}
      listingLimit={1}
      hideWriteControls={false}
    />);

    // Ensure all promises resolve
    await new Promise(resolve => process.nextTick(resolve));
    // Ensure the state changes are reflected
    component.update();

    expect(component).toMatchSnapshot();
  });

  test('hideWriteControls', async () => {
    const component = shallow(<DashboardListing
      find={find.bind(null, 0)}
      delete={() => {}}
      listingLimit={1}
      hideWriteControls={true}
    />);

    // Ensure all promises resolve
    await new Promise(resolve => process.nextTick(resolve));
    // Ensure the state changes are reflected
    component.update();

    expect(component).toMatchSnapshot();
  });

  test('renders warning when listingLimit is exceeded', async () => {
    const component = shallow(<DashboardListing
      find={find.bind(null, 2)}
      delete={() => {}}
      listingLimit={1}
      hideWriteControls={false}
    />);

    // Ensure all promises resolve
    await new Promise(resolve => process.nextTick(resolve));
    // Ensure the state changes are reflected
    component.update();

    expect(component).toMatchSnapshot();
  });
});
