/* Main 'view' of the app */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Calendar from './Calendar.js';
import Profile from './Profile.js';
import Login from './Login.js';

/* Styles */
const deviceW = Dimensions.get('window').width;
const basePx = 375;
function px2dp(px) {
  return (px * deviceW) / basePx;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  shareText: {
    fontSize: 20,
    margin: 10,
  },
});
/* -------------------------------------------------------------------------- */

/* Suppress warnings for now */
console.disableYellowBox = true;

export const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/'
    : 'http://localhost:3000/';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* User's info states */
      year_level: '',
      courses: [],
      sex: '0',
      number_of_ratings: '0.0',
      kindness_pref: '0.0',
      patience_pref: '0.0',
      hard_working_pref: '0.0',
      authentication_token: '',
      password: '',
      user_id: '',
      email: '',
      name: '',
      scheduleArray: [],

      /* Transition states */
      loggedIn: false,
      selectedTab: 'calendar',
    };
  }

  /* Helper functions that modify user info states (called by other classes) */
  changeUserID(data) {
    this.setState({ user_id: data });
  }

  changePassword(data) {
    this.setState({ password: data });
  }

  changeYearLevel(data) {
    this.setState({ year_level: data });
  }

  changeCourses(data) {
    this.setState({ courses: data });
  }

  changeSex(data) {
    this.setState({ sex: data });
  }

  changeNumberOfRatings(data) {
    this.setState({ number_of_ratings: data });
  }

  changeKindnessPref(data) {
    this.setState({ kindness_pref: data });
  }

  changePatiencePref(data) {
    this.setState({ patience_pref: data });
  }

  changeHardWorkingPref(data) {
    this.setState({ hard_working_pref: data });
  }

  changeAuthenticationToken(data) {
    this.setState({ authentication_token: data });
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
            selected={this.state.selectedTab === 'calendar'}
            title="Calendar"
            selectedTitleStyle={{ color: '#3496f0' }}
            renderIcon={() => (
              <Icon name="calendar" size={px2dp(22)} color="#666" />
            )}
            renderSelectedIcon={() => (
              <Icon name="calendar" size={px2dp(22)} color="#3496f0" />
            )}
            onPress={() => this.setState({ selectedTab: 'calendar' })}>
            <Calendar
              /* States */
              user_id={this.state.user_id}
              scheduleArray={this.state.scheduleArray}
              /* Functions */
              scheduleArrayAdd={this.addScheduleArray.bind(this)}
              scheduleArrayClear={this.clearScheduleArray.bind(this)}
              scheduleArrayChange={this.changeScheduleArray.bind(this)}
            />
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'profile'}
            title="Profile"
            selectedTitleStyle={{ color: '#3496f0' }}
            renderIcon={() => (
              <Icon name="user" size={px2dp(22)} color="#666" />
            )}
            renderSelectedIcon={() => (
              <Icon name="user" size={px2dp(22)} color="#3496f0" />
            )}
            onPress={() => this.setState({ selectedTab: 'profile' })}>
            <Profile
              /* States */
              year_level={this.state.year_level}
              courses={this.state.courses}
              sex={this.state.sex}
              number_of_ratings={this.state.number_of_ratings}
              kindness_pref={this.state.kindness_pref}
              patience_pref={this.state.patience_pref}
              hard_working_pref={this.state.hard_working_pref}
              authentication_token={this.state.authentication_token}
              password={this.state.password}
              user_id={this.state.user_id}
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
          user_id={this.state.user_id}
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

