/* Main "view" of the app */

import React, { Component } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import TabNavigator from "react-native-tab-navigator";
import Calendar from "./Calendar.js";
import Profile from "./Profile.js";
import Login from "./Login.js";
import Matches from "./Matches.js"
import NotifService from "./NotifService";

/* Suppress warnings for now */
console.disableYellowBox = true;

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

/* For server uses */
export const baseURL =
  Platform.OS === "android"
    ? "http://104.211.35.37:8081/"
    : "http://104.211.35.37:8081/";

/* For emulator */
// export const baseURL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000/"
//     : "http://localhost:3000/";

/* For physical device */
// export const baseURL =
//   Platform.OS === "android"
//     ? "http://127.0.0.1:3000/"
//     : "http://localhost:3000/";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* User"s info states */
      yearLevel: "",
      courses: [],
      sex: "0",
      numberOfRatings: "0.0",
      kindnessSelfRate: "0.0",
      patienceSelfRate: "0.0",
      hardWorkingSelfRate: "0.0",
      authenticationToken: "",
      password: "",
      userID: "",
      email: "",
      name: "",

      sexPref: "0",
      yearLevelPref: "",
      coursesPref: [],
      kindnessPref: "0.0",
      patiencePref: "0.0",
      hardWorkingPref: "0.0",

      scheduleArray: [],
      eventID: 0,

      currentMatches: [],
      incomingMatches: [],
      potentialMatches: [],
      waitingMatches: [],

      /* Transition states */
      loggedIn: false,
      selectedTab: "calendar",
    };

    /* Push notification */
    this.notif = new NotifService(this.onNotif.bind(this));
  }

  /* Push notification */
  onNotif(notif) {
    //console.log(notif);
    Alert.alert(notif.title, notif.message);
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

  changeKindnessSelfRate(data) {
    this.setState({ kindnessSelfRate: data });
  }

  changePatienceSelfRate(data) {
    this.setState({ patienceSelfRate: data });
  }

  changeHardWorkingSelfRate(data) {
    this.setState({ hardWorkingSelfRate: data });
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

  changeKindnessPref(data) {
    this.setState({ kindnessPref: data });
  }

  changePatiencePref(data) {
    this.setState({ patiencePref: data });
  }

  changeHardWorkingPref(data) {
    this.setState({ hardWorkingPref: data });
  }

  changeSexPref(data) {
    this.setState({ sexPref: data });
  }

  changeYearLevelPref(data) {
    this.setState({ yearLevelPref: data });
  }

  changeCoursesPref(data) {
    this.setState({ coursesPref: data });
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

  changeEventID(data) {
    this.setState({ eventID: data });
  }

  deleteCurrentMatchesElement(idx, length) {
    tmp = this.state.currentMatches;
    tmp.splice(idx, length);
    this.setState({ currentMatches: [] });
    this.setState({ currentMatches: tmp });
  }

  deleteIncomingMatchesElement(idx, length) {
    tmp = this.state.incomingMatches;
    tmp.splice(idx, length);
    this.setState({ incomingMatches: [] });
    this.setState({ incomingMatches: tmp });
  }

  deletePotentialMatchesElement(idx, length) {
    tmp = this.state.potentialMatches;
    tmp.splice(idx, length);
    this.setState({ potentialMatches: [] });
    this.setState({ potentialMatches: tmp });
  }

  clearCurrentMatches() {
    this.setState({ currentMatches: [] });
  }

  clearIncomingMatches() {
    this.setState({ incomingMatches: [] });
  }

  clearPotentialMatches() {
    this.setState({ potentialMatches: [] });
  }

  clearWaitingMatches() {
    this.setState({ waitingMatches: [] });
  }

  addCurrentMatches(data) {
    this.setState({ currentMatches: this.state.currentMatches.concat(data) });
  }

  addIncomingMatches(data) {
    this.setState({ incomingMatches: this.state.incomingMatches.concat(data) });
  }

  addPotentialMatches(data) {
    this.setState({ potentialMatches: this.state.potentialMatches.concat(data) });
  }

  addWaitingMatches(data) {
    this.setState({ waitingMatches: this.state.waitingMatches.concat(data) });
  }

  /* Helper functions that change the corresponding views of the app */
  changeLogVisible() {
    this.setState({ loggedIn: !this.state.loggedIn });
  }

  changeDefaultSelectedTab() {
    this.setState({ selectedTab: "calendar" });
  }


  /* -------------------------------------------------------------------------- */

  render() {
    if (this.state.loggedIn) {
      return (
        <TabNavigator style={styles.container}>
          <TabNavigator.Item
            testID="calendarTab"
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
              eventID={this.state.eventID}
              /* Functions */
              scheduleArrayAdd={this.addScheduleArray.bind(this)}
              scheduleArrayClear={this.clearScheduleArray.bind(this)}
              scheduleArrayChange={this.changeScheduleArray.bind(this)}
              eventIDChange={this.changeEventID.bind(this)}
            />
          </TabNavigator.Item>

          <TabNavigator.Item
            testID="matchesTab"
            selected={this.state.selectedTab === "matches"}
            title="Matches"
            selectedTitleStyle={{ color: "#3496f0" }}
            renderIcon={() => (
              <Icon name="handshake-o" size={px2dp(22)} color="#666" />
            )}
            renderSelectedIcon={() => (
              <Icon name="handshake-o" size={px2dp(22)} color="#3496f0" />
            )}
            onPress={() => this.setState({ selectedTab: "matches" })}>
            <Matches
              /* States */
              currentMatches={this.state.currentMatches}
              incomingMatches={this.state.incomingMatches}
              potentialMatches={this.state.potentialMatches}
              waitingMatches={this.state.waitingMatches}
              userID={this.state.userID}
              scheduleArray={this.state.scheduleArray}

              /* Functions */
              deleteCurrentMatchesElement={this.deleteCurrentMatchesElement.bind(this)}
              deleteIncomingMatchesElement={this.deleteIncomingMatchesElement.bind(this)}
              deletePotentialMatchesElement={this.deletePotentialMatchesElement.bind(this)}
              currentMatchesClear={this.clearCurrentMatches.bind(this)}
              incomingMatchesClear={this.clearIncomingMatches.bind(this)}
              potentialMatchesClear={this.clearPotentialMatches.bind(this)}
              waitingMatchesClear={this.clearPotentialMatches.bind(this)}
              currentMatchesAdd={this.addCurrentMatches.bind(this)}
              incomingMatchesAdd={this.addIncomingMatches.bind(this)}
              potentialMatchesAdd={this.addPotentialMatches.bind(this)}
              waitingMatchesAdd={this.addWaitingMatches.bind(this)}
            />
          </TabNavigator.Item>

          <TabNavigator.Item
            testID="profileTab"
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
              kindnessSelfRate={this.state.kindnessSelfRate}
              patienceSelfRate={this.state.patienceSelfRate}
              hardWorkingSelfRate={this.state.hardWorkingSelfRate}
              authenticationToken={this.state.authenticationToken}
              password={this.state.password}
              userID={this.state.userID}
              email={this.state.email}
              name={this.state.name}

              sexPref={this.state.sexPref}
              yearLevelPref={this.state.yearLevelPref}
              coursesPref={this.state.coursesPref}
              kindnessPref={this.state.kindnessPref}
              patiencePref={this.state.patiencePref}
              hardWorkingPref={this.state.hardWorkingPref}

              /* Functions */
              yearLevelChange={this.changeYearLevel.bind(this)}
              coursesChange={this.changeCourses.bind(this)}
              sexChange={this.changeSex.bind(this)}
              numberOfRatingsChange={this.changeNumberOfRatings.bind(this)}
              kindnessSelfRateChange={this.changeKindnessSelfRate.bind(this)}
              patienceSelfRateChange={this.changePatienceSelfRate.bind(this)}
              hardWorkingSelfRateChange={this.changeHardWorkingSelfRate.bind(this)}
              authenticationTokenChange={this.changeAuthenticationToken.bind(
                this
              )}
              emailChange={this.changeEmail.bind(this)}
              nameChange={this.changeName.bind(this)}
              userIDChange={this.changeUserID.bind(this)}
              passwordChange={this.changePassword.bind(this)}

              kindnessPrefChange={this.changeKindnessPref.bind(this)}
              patiencePrefChange={this.changePatiencePref.bind(this)}
              hardWorkingPrefChange={this.changeHardWorkingPref.bind(this)}
              sexPrefChange={this.changeSexPref.bind(this)}
              yearLevelPrefChange={this.changeYearLevelPref.bind(this)}
              coursesPrefChange={this.changeCoursesPref.bind(this)}

              logVisibleChange={this.changeLogVisible.bind(this)}
              defaultSelectedTabChange={this.changeDefaultSelectedTab.bind(this)}
              /* Push notification */
              push_noti={this.notif}
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
          eventID={this.state.eventID}
          currentMatches={this.state.currentMatches}
          incomingMatches={this.state.incomingMatches}
          potentialMatches={this.state.potentialMatches}
          waitingMathces={this.state.waitingMatches}

          /* Functions */
          yearLevelChange={this.changeYearLevel.bind(this)}
          coursesChange={this.changeCourses.bind(this)}
          sexChange={this.changeSex.bind(this)}
          numberOfRatingsChange={this.changeNumberOfRatings.bind(this)}
          kindnessSelfRateChange={this.changeKindnessSelfRate.bind(this)}
          patienceSelfRateChange={this.changePatienceSelfRate.bind(this)}
          hardWorkingSelfRateChange={this.changeHardWorkingSelfRate.bind(this)}
          authenticationTokenChange={this.changeAuthenticationToken.bind(this)}
          emailChange={this.changeEmail.bind(this)}
          nameChange={this.changeName.bind(this)}
          userIDChange={this.changeUserID.bind(this)}
          passwordChange={this.changePassword.bind(this)}
          scheduleArrayAdd={this.addScheduleArray.bind(this)}
          scheduleArrayClear={this.clearScheduleArray.bind(this)}
          scheduleArrayChange={this.changeScheduleArray.bind(this)}
          logVisibleChange={this.changeLogVisible.bind(this)}
          eventIDChange={this.changeEventID.bind(this)}
          currentMatchesClear={this.clearCurrentMatches.bind(this)}
          incomingMatchesClear={this.clearIncomingMatches.bind(this)}
          potentialMatchesClear={this.clearPotentialMatches.bind(this)}
          waitingMatchesClear={this.clearPotentialMatches.bind(this)}
          currentMatchesAdd={this.addCurrentMatches.bind(this)}
          incomingMatchesAdd={this.addIncomingMatches.bind(this)}
          potentialMatchesAdd={this.addPotentialMatches.bind(this)}
          waitingMatchesAdd={this.addWaitingMatches.bind(this)}

          kindnessPrefChange={this.changeKindnessPref.bind(this)}
          patiencePrefChange={this.changePatiencePref.bind(this)}
          hardWorkingPrefChange={this.changeHardWorkingPref.bind(this)}
          sexPrefChange={this.changeSexPref.bind(this)}
          yearLevelPrefChange={this.changeYearLevelPref.bind(this)}
          coursesPrefChange={this.changeCoursesPref.bind(this)}

          /* Push notification */
          push_noti={this.notif}
        />
      );
    }
  }
}
