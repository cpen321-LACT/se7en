/**
 * @format
 */

import "react-native";
//import React from "react"; uncomment when we test with jsx object
import App from "../App";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("renders correctly", () => {
  renderer.create(<App> </App>);
});
