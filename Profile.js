"use strict";

import React from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  StatusBar,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import ActionButton from "react-native-action-button";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
import {
  SettingsScreen,
} from "react-native-settings-screen";
import { TextField } from "react-native-material-textfield";
import { TextButton } from "react-native-material-buttons";
import BackgroundTimer from "react-native-background-timer";

/* -------------------------------------------------------------------------- */
/* Styles */
const fontFamily = Platform.OS === "ios" ? "Avenir" : "sans-serif";
const statusBarHeight = Platform.OS === "ios" ? 35 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  navBar: {
    backgroundColor: "#4286f4",
    height: 44 + statusBarHeight,
    alignSelf: "stretch",
    paddingTop: statusBarHeight,
    justifyContent: "center",
    alignItems: "center"
  },
  navBarTitle: {
    color: "#FFF",
    fontFamily,
    fontSize: 17
  },
  heroContainer: {
    marginTop: 0,
    marginBottom: 20,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#4286f4",
    flexDirection: "row"
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#4286f4",
    marginHorizontal: 20
  },
  heroTitle: {
    fontFamily,
    color: "black",
    fontSize: 24
  },
  heroSubtitle: {
    fontFamily,
    color: "#999",
    fontSize: 14
  },

  scroll: {
    backgroundColor: "transparent"
  },

  inputContainer: {
    margin: 8,
    marginTop: Platform.select({ ios: 2, android: 2 }),
    flex: 1
  },

  contentContainer: {
    padding: 8
  },

  buttonContainer: {
    paddingTop: 8,
    margin: 8
  },

  safeContainer: {
    flex: 1,
    backgroundColor: "white"
  }
});

/* -------------------------------------------------------------------------- */

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

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* User info states */
      tmpYearLevel: this.props.yearLevel,
      tmpCourses: this.props.courses,
      tmpCoursesString: this.props.courses.toString(),
      tmpSex: this.props.sex,
      tmpKindnessSelfRate: this.props.kindnessSelfRate,
      tmpPatienceSelfRate: this.props.patienceSelfRate,
      tmpHardWorkingSelfRate: this.props.hardWorkingSelfRate,
      tmpPassword: this.props.password,
      tmpEmail: this.props.email,
      tmpName: this.props.name,

      tmpSexPref: this.props.sexPref,
      tmpYearLevelPref: this.props.yearLevelPref,
      tmpCoursesPref: this.props.coursesPref,
      tmpCoursesPrefString: this.props.coursesPref.toString(),
      tmpKindnessPref: this.props.kindnessPref,
      tmpPatiencePref: this.props.patiencePref,
      tmpHardWorkingPref: this.props.hardWorkingPref,

      /* Transition states */
      userEdit: false,
      secureTextEntry: true
    };
  }

  /* Layout of information for rendering */
  settingsData = [
    {
      type: "CUSTOM_VIEW",
      render: () => (
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri:
                "https://vignette.wikia.nocookie.net/internet-meme/images/0/0b/Monkathink.jpg/revision/latest?cb=20180310164639",
            }}
            style={styles.heroImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{this.props.name}</Text>
            <Text style={styles.heroSubtitle}>
              User ID: {this.props.userID}
            </Text>
          </View>
        </View>
      ),
    },
    {
      type: "SECTION",
      header: "My info".toUpperCase(),
      rows: [
        {
          title: "Name",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.name}
            </Text>
          ),
        },
        {
          title: "Email",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.email}
            </Text>
          ),
        },
        {
          title: "Sex",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.sex}
            </Text>
          ),
        },
        {
          title: "Year level",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.yearLevel}
            </Text>
          ),
        },
        {
          title: "Courses",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.courses}
            </Text>
          ),
        },
        {
          title: "Number of Ratings",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.numberOfRatings}
            </Text>
          ),
        },
        {
          title: "Kindness",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.kindnessSelfRate}
            </Text>
          ),
        },
        {
          title: "Patience",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.patienceSelfRate}
            </Text>
          ),
        },
        {
          title: "Hardworking",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.hardWorkingSelfRate}
            </Text>
          ),
        },
      ],
    },
    {
      type: "SECTION",
      header: "My preferences".toUpperCase(),
      footer:
        "( ´ ω ` )ノﾞ ( ´ ω ` )ノﾞ ( ´ ω ` )ノﾞ ( ´ ω ` )ノﾞ ( ´ ω ` )ノﾞ             ~ヾ(・ω・) ~ヾ(・ω・) ~ヾ(・ω・) ~ヾ(・ω・)",
      rows: [
        {
          title: "Sex",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.sexPref}
            </Text>
          ),
        },
        {
          title: "Year level",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.yearLevelPref}
            </Text>
          ),
        },
        {
          title: "Courses",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.coursesPref}
            </Text>
          ),
        },
        {
          title: "Kindness",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.kindnessPref}
            </Text>
          ),
        },
        {
          title: "Patience",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.patiencePref}
            </Text>
          ),
        },
        {
          title: "Hardworking",
          renderAccessory: () => (
            <Text style={{ color: "#999", marginRight: 6, fontSize: 18 }}>
              {this.props.hardWorkingPref}
            </Text>
          ),
        },
      ],
    },
    {
      type: "CUSTOM_VIEW",
      render: () => (
        <Text
          style={{
            alignSelf: "center",
            fontSize: 18,
            color: "#999",
            marginBottom: 40,
            marginTop: -30,
            fontFamily
          }}>
          v2.0.0
        </Text>
      ),
    },
  ];

  /* Function that handles refresh calls */
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getUserInfo();
    this.getUserReferences();
    this.setState({ refreshing: false });
  };

  /* Function that gets user"s info (for refreshing) */
  getUserInfo() {
    let fetchURL = baseURL + "user/" + this.props.userID + "/info";
    fetch(fetchURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (typeof responseJson !== "undefined") {
          this.props.yearLevelChange(responseJson[0].yearLevel);
          this.props.coursesChange(responseJson[0].courses);
          this.props.sexChange(responseJson[0].sex);
          this.props.numberOfRatingsChange(
            responseJson[0].numberOfRatings
          );
          this.props.kindnessSelfRateChange(responseJson[0].kindness);
          this.props.patienceSelfRateChange(responseJson[0].patience);
          this.props.hardWorkingSelfRateChange(responseJson[0].hardWorking);
          this.props.authenticationTokenChange(
            responseJson[0].authenticationToken
          );
          this.props.passwordChange(responseJson[0].password);
          this.props.emailChange(responseJson[0].email);
          this.props.nameChange(responseJson[0].name);
        }
      });
  }

  /* Function that gets user"s references (for refreshing) */
  getUserReferences() {
    //console.log("[getUserReferences]: " + this.props.kindnessPref);
    let fetchURL = baseURL + "user/" + this.props.userID + "/preferences";
    fetch(fetchURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (typeof responseJson !== "undefined") {
          this.props.kindnessPrefChange(responseJson[0].kindness);
          this.props.patiencePrefChange(responseJson[0].patience);
          this.props.hardWorkingPrefChange(responseJson[0].hardWorking);
          this.props.coursesPrefChange(responseJson[0].courses);
          this.props.sexPrefChange(responseJson[0].sex);
          this.props.yearLevelPrefChange(responseJson[0].yearLevel);
        }
      });
  }

  /* Function that pushes all the changes of user"s info to the database */
  pushUserInfo() {
    /* First check for error */
    console.log("here");
    var toCheck = [this.state.tmpYearLevel, this.state.tmpCoursesString, this.state.tmpSex, this.state.tmpPassword, this.state.tmpEmail, this.state.tmpName, this.state.tmpKindnessSelfRate, this.state.tmpPatienceSelfRate, this.state.tmpHardWorkingSelfRate, this.state.tmpSexPref, this.state.tmpYearLevelPref, this.state.tmpCoursesPrefString, this.state.tmpKindnessPref, this.state.tmpPatiencePref, this.state.tmpHardWorkingPref];
    for (var i = 0; i < toCheck.length; i++) {
      if (this.checkNULL(toCheck[i]) || this.checkEmpty(toCheck[i])) {
        Alert.alert("One of the fields must not be NULL or empty");
        return;
      }
    }

    /* Check for sum of prefs */
    if (this.checkSumPrefs(this.state.tmpKindnessSelfRate, this.state.tmpPatienceSelfRate, this.state.tmpHardWorkingSelfRate)) {
      Alert.alert(
        "The sum of Kindness, Patience and Hardworking Self-ratings must be exactly 12"
      );
      return;
    }

    if (this.checkSumPrefs(this.state.tmpKindnessPref, this.state.tmpPatiencePref, this.state.tmpHardWorkingPref)) {
      Alert.alert(
        "The sum of Kindness, Patience and Hardworking Preferences must be exactly 12"
      );
      return;
    }

    /* If there"s no error, we do the call */
    /* Split course string -> array first */
    this.setState({ tmpCourses: this.state.tmpCoursesString.split(",") });
    let fetchURL = baseURL + "user/" + this.props.userID + "/info";
    console.log("[pushUserInfo] url request: " + fetchURL);
    fetch(fetchURL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        yearLevel: this.state.tmpYearLevel,
        courses: this.state.tmpCourses,
        sex: this.state.tmpSex,
        numberOfRatings: this.props.numberOfRatings,
        kindness: this.state.tmpKindnessSelfRate,
        patience: this.state.tmpPatienceSelfRate,
        hardWorking: this.state.tmpHardWorkingSelfRate,
        authenticationToken: this.props.authenticationToken,
        password: this.state.tmpPassword,
        email: this.state.tmpEmail,
        name: this.state.tmpName
      }),
    })
      .then((response) => response.text())
      /* Then we apply to the local variables for rendering */
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.includes("doesn't exists")) {
          Alert.alert("Failed to update information, please try again!");
          return;
        }
        //console.log(responseJson);
        else if (responseJson.includes("Cannot PUT")) {
          Alert.alert("Cannot change profile, please try again");
        }
        else {
          this.props.yearLevelChange(this.state.tmpYearLevel);
          this.props.coursesChange(this.state.tmpCourses);
          this.props.sexChange(this.state.tmpSex);
          // Number of ratings unchanged
          this.props.kindnessSelfRateChange(this.state.tmpKindnessSelfRate);
          this.props.patienceSelfRateChange(this.state.tmpPatienceSelfRate);
          this.props.hardWorkingSelfRateChange(this.state.tmpHardWorkingSelfRate);
          // Authentication token unchanged
          this.props.passwordChange(this.state.tmpPassword);
          // User ID unchanged
          this.props.emailChange(this.state.tmpEmail);
          this.props.nameChange(this.state.tmpName);

          this.pushUserPreferences();
        }
      });
  }

  /* Function that pushes all the changes of user"s preferences to the database */
  pushUserPreferences() {
    /* Split course string -> array first */
    this.setState({ tmpCoursesPref: this.state.tmpCoursesPrefString.split(",") });
    let fetchURL = baseURL + "user/" + this.props.userID + "/preferences";
    //console.log("[pushUserPreferences] url request: " + fetchURL);
    fetch(fetchURL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kindness: this.state.tmpKindnessPref,
        patience: this.state.tmpPatiencePref,
        hardWorking: this.state.tmpHardWorkingPref,
        courses: this.state.tmpCoursesPref,
        sex: this.state.tmpSexPref,
        yearLevel: this.state.tmpYearLevelPref
      })
    })
      .then((response) => response.text())
      .then((responseJson) => {
        //console.log(responseJson);
        if (responseJson.includes("does not exists")) {
          Alert.alert("Failed to update preferences, please try again!");
          return;
        }
        else if (responseJson.includes("Cannot POST")) {
          Alert.alert("Cannot change profile, please try again");
          return;
        }
        else {
          this.props.sexPrefChange(this.state.tmpSexPref);
          this.props.yearLevelPrefChange(this.state.tmpYearLevelPref);
          this.props.coursesPrefChange(this.state.tmpCoursesPref);
          this.props.kindnessPrefChange(this.state.tmpKindnessPref);
          this.props.patiencePrefChange(this.state.tmpPatiencePref);
          this.props.hardWorkingPrefChange(this.state.tmpHardWorkingPref);

          Alert.alert("Updated successfully!");
          /* Render the Profile view again */
          this.unrenderUserform();
        }
      });
  }

  /* Sign out sequence */
  signOut() {
    this.props.logVisibleChange();
    this.props.userIDChange("");
    this.props.passwordChange("");
    this.props.defaultSelectedTabChange();
    /* Stop push notification timer as well */
    BackgroundTimer.stopBackgroundTimer();
  }

  /* Helper functions that (un)render the user input forms */
  renderUserform() {
    this.setState({ userEdit: true });
  }

  unrenderUserform() {
    this.setState({ userEdit: false });
  }

  /* Helper functions that render characters for password */
  onAccessoryPress() {
    this.setState({ secureTextEntry: !this.state.secureTextEntry });
  }

  renderPasswordAccessory() {
    let name = this.state.secureTextEntry ? "visibility" : "visibility-off";

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

  /* Helper functions that check whether or not any fields are NULL/empty */
  checkNULL(data) {
    //console.log("Check NULL: data = " + data);
    if (typeof data === "undefined") {
      return true;
    }
    else {
      return false;
    }
  }

  checkEmpty(data) {
    console.log("Check empty: data = " + data);
    if (data === "") {
      return true;
    }
    else {
      return false;
    }
  }

  checkSumPrefs(pref1, pref2, pref3) {
    if (pref1 + pref2 + pref3 !== 12) {
      return true;
    }
    else {
      return false;
    }
  }

  /* -------------------------------------------------------------------------- */

  render() {
    if (!this.state.userEdit) {
      return (
        <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
          {
            <SafeAreaView testID="profileView">
              <ScrollView
                testID="profileScrollView"
                refreshControl={
                  <RefreshControl
                    testID="profileRefresh"
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
                    testID="settingsScreen"
                    data={this.settingsData}
                    globalTextStyle={{ fontFamily }}
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          }
          <ActionButton testID="profileMainButton" buttonColor="crimson">
            <ActionButton.Item
              testID="profileChangeProfile"
              buttonColor="mediumspringgreen"
              title="Change Profile"
              onPress={() => this.renderUserform()}>
              <Icon name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              testID="profileSignOut"
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
        <SafeAreaView testID="profileChangeProfileView" style={styles.safeContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navBarTitle}>Edit profile</Text>
          </View>

          <ScrollView
            testID="profileChangeProfileScrollView"
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.safeContainer}>
              <Text style={{ fontSize: 18, flex: 1, margin: 8, textDecorationLine: "underline" }}>Basic info:</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextField
                testID="profileNameInput"
                label="Name: "
                value={this.props.name}
                characterRestriction={30}
                clearTextOnFocus={true}
                onChangeText={(data) => this.setState({ tmpName: data })}
              />

              <TextField
                testID="profilePasswordInput"
                label="Password: "
                value={this.props.password}
                characterRestriction={20}
                clearTextOnFocus={true}
                secureTextEntry={this.state.secureTextEntry}
                renderRightAccessory={this.renderPasswordAccessory()}
                onChangeText={(data) => this.setState({ tmpPassword: data })}
              />

              <TextField
                testID="profileYearLevelInput"
                label="Year level: "
                value={this.props.yearLevel}
                characterRestriction={1}
                keyboardType='number-pad'
                clearTextOnFocus={true}
                onChangeText={(data) => this.setState({ tmpYearLevel: data })}
              />

              <TextField
                testID="profileSexInput"
                label="Sex:"
                value={this.props.sex}
                characterRestriction={1}
                title="Please input as an integer (0 - Male, 1 - Female, 2 - Both)"
                keyboardType='number-pad'
                clearTextOnFocus={true}
                onChangeText={(data) => this.setState({ tmpSex: data })}
              />

              <TextField
                testID="profileEmailInput"
                label="Email: "
                value={this.props.email}
                keyboardType="email-address"
                characterRestriction={50}
                clearTextOnFocus={true}
                onChangeText={(data) => this.setState({ tmpEmail: data })}
              />

              <TextField
                testID="profileCoursesInput"
                label="Courses: "
                value={this.props.courses}
                title="Please input in form: 'Course A,Course B,Course C'"
                clearTextOnFocus={true}
                onChangeText={(data) => this.setState({ tmpCoursesString: data })}
              />

              <TextField
                testID="profileKindnessSelfRateInput"
                label="Kindness self-rating: "
                value={this.props.kindnessSelfRate}
                characterRestriction={2}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpKindnessSelfRate: parseInt(data, 10) })}
              />

              <TextField
                testID="profilePatienceSelfRateInput"
                label="Patience self-rating: "
                value={this.props.patienceSelfRate}
                characterRestriction={2}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpPatienceSelfRate: parseInt(data, 10) })}
              />

              <TextField
                testID="profileHardworkingSelfRateInput"
                label="Hardworking self-rating: "
                value={this.props.hardWorkingSelfRate}
                characterRestriction={2}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpHardWorkingSelfRate: parseInt(data, 10) })}
              />
            </View>

            <View style={styles.safeContainer}>
              <Text style={{ fontSize: 18, flex: 1, margin: 8, textDecorationLine: "underline" }}>Preferences:</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextField
                testID="signUpSexInput"
                label="Sex: "
                value={this.props.sexPref}
                clearTextOnFocus={true}
                characterRestriction={1}
                keyboardType='number-pad'
                title="Please input as an integer (0 - Male, 1 - Female, 2 - Both)"
                onChangeText={(data) => this.setState({ tmpSexPref: data })}
              />

              <TextField
                testID="signUpYearLevelInput"
                label="Year level: "
                value={this.props.yearLevelPref}
                clearTextOnFocus={true}
                characterRestriction={1}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpYearLevelPref: data })}
              />

              <TextField
                testID="signUpCoursesInput"
                label="Courses: "
                value={this.props.coursesPref}
                clearTextOnFocus={true}
                title="Please input in form: 'Course A,Course B,Course C'"
                onChangeText={(data) => this.setState({ tmpCoursesPrefString: data })}
              />

              <TextField
                testID="signUpKindnessSelfRateInput"
                label="Kindness preference: "
                value={this.props.kindnessPref}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={data => this.setState({ tmpKindnessPref: parseInt(data, 10) })}
              />

              <TextField
                testID="signUpPatienceSelfRateInput"
                label="Patience preference: "
                value={this.props.patiencePref}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={data => this.setState({ tmpPatiencePref: parseInt(data, 10) })}
              />

              <TextField
                testID="signUpHardworkingSelfRateInput"
                label="Hardworking preference: "
                value={this.props.hardWorkingPref}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={data => this.setState({ tmpHardWorkingPref: parseInt(data, 10) })}
              />
            </View>

            <View style={{
              flexDirection: "column",
              flex: 1,
              alignItems: "stretch",
              justifyContent: "center",
            }}>

              <TextButton
                testID="profileChangeButton"
                style={{ margin: 4 }}
                titleColor="white"
                color="#4286f4"
                title="change profile"
                onPress={() => this.pushUserInfo()}
              />

              <TextButton
                testID="profileChangeGoBack"
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="go back"
                onPress={() => this.unrenderUserform()}
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
