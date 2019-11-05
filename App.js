/* Main "view" of the app */

import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import TabNavigator from "react-native-tab-navigator";
import Calendar from "./Calendar.js";
import Profile from "./Profile.js";
import Login from "./Login.js";

/* Suppress warnings for now */
//console.disableYellowBox = true;

/* -------------------------------------------------------------------------- */
/* Styles */
const deviceW = Dimensions.get("window").width;
const basePx = 375;
function px2dp(px) {
  return (px * deviceW) / basePx;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  shareText: {
    fontSize: 20,
    margin: 10,
  },
});

export const baseURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/"
    : "http://localhost:3000/";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* User"s info states */
      yearLevel: "",
      courses: [],
      sex: "0",
      numberOfRatings: "0.0",
      kindnessPref: "0.0",
      patiencePref: "0.0",
      hardWorkingPref: "0.0",
      authenticationToken: "",
      password: "",
      userID: "",
      email: "",
      name: "",
      scheduleArray: [],

      /* Transition states */
      loggedIn: false,
      selectedTab: "calendar",
    };
  }

  /* Helper functions that modify user info states (called by other classes) */
  changeUserID(data) {
    this.setState({ userID: data });
  }

  changePassword(data) {
    this.setState({ password: data });
  }

  changeYearLevel(data) {
    this.setState({ yearLevel: data });
  }

  changeCourses(data) {
    this.setState({ courses: data });
  }

  changeSex(data) {
    this.setState({ sex: data });
  }

  changeNumberOfRatings(data) {
    this.setState({ numberOfRatings: data });
  }

  changeKindnessPref(data) {
    this.setState({ kindnessPref: data });
  }

  changePatiencePref(data) {
    this.setState({ patiencePref: data });
  }

  changeHardWorkingPref(data) {
    this.setState({ hardWorkingPref: data });
  }

  changeAuthenticationToken(data) {
    this.setState({ authenticationToken: data });
  }

  changeEmail(data) {
    this.setState({ email: data });
  }

  changeName(data) {
    this.setState({ name: data });
  }

  changeScheduleArray(data) {
    this.setState({ scheduleArray: data });
  }

  addScheduleArray(data) {
    this.setState({ scheduleArray: this.state.scheduleArray.concat(data) });
  }

  clearScheduleArray() {
    this.setState({ scheduleArray: [] });
  }

  /* Helper functions that change the corresponding views of the app */
  changeLogVisible() {
    this.setState({ loggedIn: !this.state.loggedIn });
  }

  /* -------------------------------------------------------------------------- */

  render() {
    if (this.state.loggedIn) {
      return (
        <TabNavigator style={styles.container}>
          <TabNavigator.Item
            selected={this.state.selectedTab === "calendar"}
            title="Calendar"
            selectedTitleStyle={{ color: "#3496f0" }}
            renderIcon={() => (
              <Icon name="calendar" size={px2dp(22)} color="#666" />
            )}
            renderSelectedIcon={() => (
              <Icon name="calendar" size={px2dp(22)} color="#3496f0" />
            )}
            onPress={() => this.setState({ selectedTab: "calendar" })}>
            <Calendar
              /* States */
              userID={this.state.userID}
              scheduleArray={this.state.scheduleArray}
              /* Functions */
              scheduleArrayAdd={this.addScheduleArray.bind(this)}
              scheduleArrayClear={this.clearScheduleArray.bind(this)}
              scheduleArrayChange={this.changeScheduleArray.bind(this)}
            />
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === "profile"}
            title="Profile"
            selectedTitleStyle={{ color: "#3496f0" }}
            renderIcon={() => (
              <Icon name="user" size={px2dp(22)} color="#666" />
            )}
            renderSelectedIcon={() => (
              <Icon name="user" size={px2dp(22)} color="#3496f0" />
            )}
            onPress={() => this.setState({ selectedTab: "profile" })}>
            <Profile
              /* States */
              yearLevel={this.state.yearLevel}
              courses={this.state.courses}
              sex={this.state.sex}
              numberOfRatings={this.state.numberOfRatings}
              kindnessPref={this.state.kindnessPref}
              patiencePref={this.state.patiencePref}
              hardWorkingPref={this.state.hardWorkingPref}
              authenticationToken={this.state.authenticationToken}
              password={this.state.password}
              userID={this.state.userID}
              email={this.state.email}
              name={this.state.name}
              /* Functions */
              yearLevelChange={this.changeYearLevel.bind(this)}
              coursesChange={this.changeCourses.bind(this)}
              sexChange={this.changeSex.bind(this)}
              numberOfRatingsChange={this.changeNumberOfRatings.bind(this)}
              kindnessPrefChange={this.changeKindnessPref.bind(this)}
              patiencePrefChange={this.changePatiencePref.bind(this)}
              hardWorkingPrefChange={this.changeHardWorkingPref.bind(this)}
              authenticationTokenChange={this.changeAuthenticationToken.bind(
                this
              )}
              emailChange={this.changeEmail.bind(this)}
              nameChange={this.changeName.bind(this)}
              userIDChange={this.changeUserID.bind(this)}
              passwordChange={this.changePassword.bind(this)}
              logVisibleChange={this.changeLogVisible.bind(this)}
            />
          </TabNavigator.Item>
        </TabNavigator>
      );
    } else {
      return (
        <Login
          /* States */
          password={this.state.password}
          userID={this.state.userID}
          scheduleArray={this.state.scheduleArray}
          /* Functions */
          yearLevelChange={this.changeYearLevel.bind(this)}
          coursesChange={this.changeCourses.bind(this)}
          sexChange={this.changeSex.bind(this)}
          numberOfRatingsChange={this.changeNumberOfRatings.bind(this)}
          kindnessPrefChange={this.changeKindnessPref.bind(this)}
          patiencePrefChange={this.changePatiencePref.bind(this)}
          hardWorkingPrefChange={this.changeHardWorkingPref.bind(this)}
          authenticationTokenChange={this.changeAuthenticationToken.bind(this)}
          emailChange={this.changeEmail.bind(this)}
          nameChange={this.changeName.bind(this)}
          userIDChange={this.changeUserID.bind(this)}
          passwordChange={this.changePassword.bind(this)}
          scheduleArrayAdd={this.addScheduleArray.bind(this)}
          scheduleArrayClear={this.clearScheduleArray.bind(this)}
          scheduleArrayChange={this.changeScheduleArray.bind(this)}
          logVisibleChange={this.changeLogVisible.bind(this)}
        />
      );
    }
  }
}
