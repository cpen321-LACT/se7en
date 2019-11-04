'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  View,
  StatusBar,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SettingsScreen,
} from 'react-native-settings-screen';
import { TextField } from 'react-native-material-textfield';
import { TextButton } from 'react-native-material-buttons';

export const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/'
    : 'http://localhost:3000/';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* User info states */
      tmpYearLevel: this.props.year_level,
      tmpCourses: this.props.courses,
      tmpCoursesString: '',
      tmpSex: this.props.sex,
      tmpKindness: this.props.kindness_pref,
      tmpPatience: this.props.patience_pref,
      tmpHardWorking: this.props.hard_working_pref,
      tmpPassword: this.props.password,
      tmpEmail: this.props.email,
      tmpName: this.props.name,
      /* Transition states */
      userEdit: false,
      secureTextEntry: true,
      refreshing: false,
      error: false,
    };
  }

  /* Layout of information for rendering */
  settingsData = [
    {
      type: 'CUSTOM_VIEW',
      render: () => (
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri:
                'https://vignette.wikia.nocookie.net/internet-meme/images/0/0b/Monkathink.jpg/revision/latest?cb=20180310164639',
            }}
            style={styles.heroImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{this.props.name}</Text>
            <Text style={styles.heroSubtitle}>
              User ID: {this.props.user_id}
            </Text>
          </View>
        </View>
      ),
    },
    {
      type: 'SECTION',
      header: 'My info'.toUpperCase(),
      footer:
        'Donec sed odio dui. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
      rows: [
        {
          title: 'Name',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.name}
            </Text>
          ),
        },
        {
          title: 'Email',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.email}
            </Text>
          ),
        },
        {
          title: 'Sex',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.sex}
            </Text>
          ),
        },
        {
          title: 'Year level',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.year_level}
            </Text>
          ),
        },
        {
          title: 'Courses',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.courses}
            </Text>
          ),
        },
        {
          title: 'Number of Ratings',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.number_of_ratings}
            </Text>
          ),
        },
        {
          title: 'Kindness',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.kindness_pref}
            </Text>
          ),
        },
        {
          title: 'Patience',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.patience_pref}
            </Text>
          ),
        },
        {
          title: 'Hardworking',
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.hard_working_pref}
            </Text>
          ),
        },
      ],
    },
    {
      type: 'CUSTOM_VIEW',
      render: () => (
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 18,
            color: '#999',
            marginBottom: 40,
            marginTop: -30,
            fontFamily,
          }}>
          v1.0.0
        </Text>
      ),
    },
  ];

  /* Function that handles refresh calls */
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getUserInfo();
    this.setState({ refreshing: false });
  };

  /* Function that gets user's info (for refreshing) */
  getUserInfo() {
    let fetchURL = baseURL + 'user/:' + this.props.user_id + '/info';
    fetch(fetchURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //console.log(responseJson)
        if (typeof responseJson !== 'undefined') {
          this.props.yearLevelChange(responseJson[0].year_level);
          this.props.coursesChange(responseJson[0].courses);
          this.props.sexChange(responseJson[0].sex);
          this.props.numberOfRatingsChange(
            responseJson.number_of_ratings
          );
          this.props.kindnessPrefChange(responseJson[0].kindness);
          this.props.patiencePrefChange(responseJson[0].patience);
          this.props.hardWorkingPrefChange(responseJson[0].hard_working);
          this.props.authenticationTokenChange(
            responseJson[0].authentication_token
          );
          this.props.passwordChange(responseJson[0].password);
          //this.props.userIDChange(responseJson[0].user_id);
          this.props.emailChange(responseJson[0].email);
          this.props.nameChange(responseJson[0].name);
        } else {
          // Do nothing
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Function that pushes all the changes of user's info to the database */
  pushUserInfo() {
    /* First check for error */
    this.checkError();
    if (this.state.error === false) {
      /* If there's no error, we do the call */
      /* Split course string -> array first */
      this.setState({ tmpCourses: this.state.tmpCoursesString.split(",") })
      let fetchURL = baseURL + 'user/:' + this.props.user_id + '/info';
      fetch(fetchURL, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year_level: this.state.tmpYearLevel,
          courses: this.state.tmpCourses,
          sex: this.state.tmpSex,
          number_of_ratings: this.props.number_of_ratings,
          kindness: this.props.kindness_pref,
          patience: this.props.patience_pref,
          hard_working: this.props.hard_working_pref,
          authentication_token: this.props.authentication_token,
          password: this.state.tmpPassword,
          email: this.state.tmpEmail,
          name: this.state.tmpName,
        }),
      })
        .then(response => response.text())
        /* Then we apply to the local variables for rendering */
        .then(responseJson => {
          if (responseJson.includes("already exists")) {
            Alert.alert("Failed to update information, please try again!");
            return;
          }
          console.log(responseJson);
          this.props.yearLevelChange(this.state.tmpYearLevel);
          this.props.coursesChange(this.state.tmpCourses);
          this.props.sexChange(this.state.tmpSex);
          // Number of ratings unchanged
          this.props.kindnessPrefChange(this.state.tmpKindness);
          this.props.patiencePrefChange(this.state.tmpPatience);
          this.props.hardWorkingPrefChange(this.state.tmpHardWorking);
          // Authentication token unchanged
          this.props.passwordChange(this.state.tmpPassword);
          // User ID unchanged
          this.props.emailChange(this.state.tmpEmail);
          this.props.nameChange(this.state.tmpName);
          Alert.alert('Updated successfully!');
          /* Render the Profile view again */
          this.setState({ userEdit: false });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  /* Helper functions that (un)render the user input forms */
  renderUserform() {
    this.setState({ userEdit: true });
    //console.log('userform requested!');
  }

  unrenderUserform() {
    this.setState({ userEdit: false });
    //console.log('go back!');
  }

  /* Helper functions that render characters for password */
  onAccessoryPress() {
    this.setState({ secureTextEntry: !this.state.secureTextEntry });
  }

  renderPasswordAccessory() {
    let name = this.state.secureTextEntry ? 'visibility' : 'visibility-off';

    return (
      <MaterialIcon
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={() => this.onAccessoryPress()}
        suppressHighlighting={true}
      />
    );
  }

  /* Helper function that checks for error on user inputs (NULL/empty) */
  checkError() {
    if (
      typeof this.state.tmpYearLevel === 'undefined' ||
      this.state.tmpYearLevel === '' ||
      typeof this.state.tmpCoursesString === 'undefined' ||
      this.state.tmpCoursesString === '' ||
      typeof this.state.tmpSex === 'undefined' ||
      this.state.tmpSex === '' ||
      typeof this.state.tmpKindness === 'undefined' ||
      this.state.tmpKindness === '' ||
      typeof this.state.tmpPatience === 'undefined' ||
      this.state.tmpPatience === '' ||
      typeof this.state.tmpHardWorking === 'undefined' ||
      this.state.tmpHardWorking === '' ||
      typeof this.state.tmpPassword === 'undefined' ||
      this.state.tmpPassword === '' ||
      typeof this.state.tmpEmail === 'undefined' ||
      this.state.tmpEmail === '' ||
      typeof this.state.tmpName === 'undefined' ||
      this.state.tmpName === ''
    ) {
      this.setState({ error: true });
      console.log(
        'Profile update - State:' +
        this.state.tmpYearLevel +
        ', ' +
        this.state.tmpCoursesString +
        ', ' +
        this.state.tmpSex +
        ', ' +
        this.state.tmpKindness +
        ', ' +
        this.state.tmpPatience +
        ', ' +
        this.state.tmpHardWorking +
        ', ' +
        this.state.tmpPassword +
        ', ' +
        this.state.tmpEmail +
        ', ' +
        this.state.tmpName
      );
      console.log(
        'Profile update - typeof:' +
        typeof this.state.tmpYearLevel +
        ', ' +
        typeof this.state.tmpCoursesString +
        ', ' +
        typeof this.state.tmpSex +
        ', ' +
        typeof this.state.tmpKindness +
        ', ' +
        typeof this.state.tmpPatience +
        ', ' +
        typeof this.state.tmpHardWorking +
        ', ' +
        typeof this.state.tmpPassword +
        ', ' +
        typeof this.state.tmpEmail +
        ', ' +
        typeof this.state.tmpName
      );
      Alert.alert('One of the fields is empty!');
    } else {
      if (
        this.state.tmpKindness +
        this.state.tmpPatience +
        this.state.tmpHardWorking <
        12
      ) {
        this.setState({ error: true });
        Alert.alert(
          'The sum of Kindness, Patience and Hardworking must be at least 12'
        );
      } else {
        this.setState({ error: false });
      }
    }
  }

  signOut() {
    this.props.logVisibleChange();
    this.props.userIDChange('');
    this.props.passwordChange('');
  }

  /* -------------------------------------------------------------------------- */

  render() {
    if (!this.state.userEdit) {
      return (
        <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
          {
            <SafeAreaView style={styles.container}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }>
                <View style={styles.container}>
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor="#4286f4"
                  />
                  <View style={styles.navBar}>
                    <Text style={styles.navBarTitle}>Settings</Text>
                  </View>

                  <SettingsScreen
                    data={this.settingsData}
                    globalTextStyle={{ fontFamily }}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          }
          <ActionButton buttonColor="rgba(66,134,244,1)">
            <ActionButton.Item
              buttonColor="rgba(66,134,244,1)"
              title="Modify Profile"
              onPress={() => this.renderUserform()}>
              <Icon name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="red"
              title="Sign Out"
              onPress={() => {
                Alert.alert("Signing out");
                this.signOut();
              }}>
              <Icon name="md-exit" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </View>
      );
    } else {
      return (
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navBarTitle}>Edit profile</Text>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.input_container}>
              <TextField
                label="Name: "
                value={this.props.name}
                characterRestriction={30}
                //clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpName: data })}
              />

              <TextField
                label="Password: "
                value={this.props.password}
                characterRestriction={20}
                //clearTextOnFocus={true}
                secureTextEntry={this.state.secureTextEntry}
                renderRightAccessory={this.renderPasswordAccessory()}
                onChangeText={data => this.setState({ tmpPassword: data })}
              />

              <TextField
                label="Year level: "
                value={this.props.year_level}
                characterRestriction={1}
                //clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpYearLevel: data })}
              />

              <TextField
                label="Sex:"
                value={this.props.sex}
                characterRestriction={1}
                title="Please input as an integer (0 - Male, 1 - Female, 2 - Both)"
                //clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpSex: data })}
              />

              <TextField
                label="Email: "
                value={this.props.email}
                keyboardType="email-address"
                characterRestriction={50}
                //clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpEmail: data })}
              />

              <TextField
                label="Courses: "
                value={this.props.courses}
                onChangeText={data => this.setState({ tmpCoursesString: data })}
              />

              <TextField
                label="Kindness preference: "
                value={this.props.kindness_pref}
                characterRestriction={2}
                onChangeText={data => this.setState({ tmpKindness: data })}
              />

              <TextField
                label="Patience preference: "
                value={this.props.patience_pref}
                characterRestriction={2}
                onChangeText={data => this.setState({ tmpPatience: data })}
              />

              <TextField
                label="Hardworking preference: "
                value={this.props.hard_working_pref}
                characterRestriction={2}
                onChangeText={data => this.setState({ tmpHardWorking: data })}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="go back"
                onPress={() => this.unrenderUserform()}
              />
              <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="change"
                onPress={() => this.pushUserInfo()}
              />
              {/* <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="log"
                onPress={() => console.log(this.state.tmpSex)}
              /> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Styles */
const fontFamily = Platform.OS === 'ios' ? 'Avenir' : 'sans-serif';
const statusBarHeight = Platform.OS === 'ios' ? 35 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    backgroundColor: '#4286f4',
    height: 44 + statusBarHeight,
    alignSelf: 'stretch',
    paddingTop: statusBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarTitle: {
    color: '#FFF',
    fontFamily,
    fontSize: 17,
  },
  heroContainer: {
    marginTop: 0,
    marginBottom: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#4286f4',
    flexDirection: 'row',
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4286f4',
    marginHorizontal: 20,
  },
  heroTitle: {
    fontFamily,
    color: 'black',
    fontSize: 24,
  },
  heroSubtitle: {
    fontFamily,
    color: '#999',
    fontSize: 14,
  },

  scroll: {
    backgroundColor: 'transparent',
  },

  input_container: {
    margin: 8,
    marginTop: Platform.select({ ios: 2, android: 2 }),
    flex: 1,
  },

  contentContainer: {
    padding: 8,
  },

  buttonContainer: {
    paddingTop: 8,
    margin: 8,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});
