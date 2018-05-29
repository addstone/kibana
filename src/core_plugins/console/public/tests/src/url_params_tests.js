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

let _ = require('lodash');
let url_params = require('../../src/autocomplete/url_params');
let autocomplete_engine = require('../../src/autocomplete/engine');

var { test, module, deepEqual } = window.QUnit;

module("Url params");

function param_test(name, description, tokenPath, expectedContext, globalParams) {

  test(name, function () {
    var urlParams = new url_params.UrlParams(description, globalParams || {});
    if (typeof tokenPath === "string") {
      tokenPath = _.map(tokenPath.split("/"), function (p) {
        p = p.split(",");
        if (p.length === 1) {
          return p[0];
        }
        return p;
      });
    }

    if (expectedContext.autoCompleteSet) {
      expectedContext.autoCompleteSet = _.map(expectedContext.autoCompleteSet, function (t) {
        if (_.isString(t)) {
          t = { name: t }
        }
        return t;
      });
      expectedContext.autoCompleteSet = _.sortBy(expectedContext.autoCompleteSet, 'name');
    }

    var context = {};

    autocomplete_engine.populateContext(tokenPath, context, null,
      expectedContext.autoCompleteSet, urlParams.getTopLevelComponents()
    );


    if (context.autoCompleteSet) {
      context.autoCompleteSet = _.sortBy(context.autoCompleteSet, 'name');
    }

    deepEqual(context, expectedContext);
  });

}

function t(name, meta, insert_value) {
  var r = name;
  if (meta) {
    r = { name: name, meta: meta };
    if (meta === "param" && !insert_value) {
      insert_value = name + "=";
    }
  }
  if (insert_value) {
    if (_.isString(r)) {
      r = { name: name }
    }
    r.insert_value = insert_value;
  }
  return r;
}

(function () {
  var params = {
    "a": ["1", "2"],
    "b": "__flag__"
  };
  param_test("settings params",
    params,
    "a/1",
    { "a": ["1"] }
  );

  param_test("autocomplete top level",
    params,
    [],
    { autoCompleteSet: [t("a", "param"), t("b", "flag")] }
  );

  param_test("autocomplete top level, with defaults",
    params,
    [],
    { autoCompleteSet: [t("a", "param"), t("b", "flag"), t("c", "param")] },
    {
      "c": [2]
    }
  );

  param_test("autocomplete values",
    params,
    "a",
    { autoCompleteSet: [t("1", "a"), t("2", "a")] }
  );

  param_test("autocomplete values flag",
    params,
    "b",
    { autoCompleteSet: [t("true", "b"), t("false", "b")] }
  );


})();
