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
    alignItems: "center",
  },
  navBar: {
    backgroundColor: "#4286f4",
    height: 44 + statusBarHeight,
    alignSelf: "stretch",
    paddingTop: statusBarHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  navBarTitle: {
    color: "#FFF",
    fontFamily,
    fontSize: 17,
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
    flexDirection: "row",
  },
  heroImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#4286f4",
    marginHorizontal: 20,
  },
  heroTitle: {
    fontFamily,
    color: "black",
    fontSize: 24,
  },
  heroSubtitle: {
    fontFamily,
    color: "#999",
    fontSize: 14,
  },

  scroll: {
    backgroundColor: "transparent",
  },

  inputContainer: {
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
    backgroundColor: "white",
  },
});

/* -------------------------------------------------------------------------- */

/* For emulator */
export const baseURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/"
    : "http://localhost:3000/";

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
      tmpKindness: this.props.kindnessPref,
      tmpPatience: this.props.patiencePref,
      tmpHardWorking: this.props.hardWorkingPref,
      tmpPassword: this.props.password,
      tmpEmail: this.props.email,
      tmpName: this.props.name,
      /* Transition states */
      userEdit: false,
      secureTextEntry: true,
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
      footer:
        "( ´ ω ` )ノﾞ ( ´ ω ` )ノﾞ ( ´ ω ` )ノﾞ ( ´ ω ` )ノﾞ ( ´ ω ` )ノﾞ             ~ヾ(・ω・) ~ヾ(・ω・) ~ヾ(・ω・) ~ヾ(・ω・)",
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
            fontFamily,
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
    this.setState({ refreshing: false });
  };

  /* Function that gets user"s info (for refreshing) */
  getUserInfo() {
    let fetchURL = baseURL + "user/:" + this.props.userID + "/info";
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
            responseJson.numberOfRatings
          );
          this.props.kindnessPrefChange(responseJson[0].kindness);
          this.props.patiencePrefChange(responseJson[0].patience);
          this.props.hardWorkingPrefChange(responseJson[0].hardWorking);
          this.props.authenticationTokenChange(
            responseJson[0].authenticationToken
          );
          this.props.passwordChange(responseJson[0].password);
          this.props.emailChange(responseJson[0].email);
          this.props.nameChange(responseJson[0].name);
        }
      });
  }

  /* Function that pushes all the changes of user"s info to the database */
  pushUserInfo() {
    /* First check for error */
    console.log("here");
    var toCheck = [this.state.tmpName, this.state.tmpPassword, this.state.tmpYearLevel, this.state.tmpSex, this.state.tmpEmail, this.state.tmpCoursesString, this.state.tmpKindness, this.state.tmpPatience, this.state.tmpHardWorking];
    for (var i = 0; i < toCheck.length; i++) {
      if (this.checkNULL(toCheck[i]) || this.checkEmpty(toCheck[i])) {
        Alert.alert("One of the fields must not be NULL or empty");
        return;
      }
    }

    /* Check for sum of prefs */
    if (this.checkSumPrefs()) {
      Alert.alert(
        "The sum of Kindness, Patience and Hardworking must be at least 12"
      );
      return;
    }

    /* If there"s no error, we do the call */
    /* Split course string -> array first */
    this.setState({ tmpCourses: this.state.tmpCoursesString.split(",") });
    let fetchURL = baseURL + "user/:" + this.props.userID + "/info";
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
        kindness: this.props.kindnessPref,
        patience: this.props.patiencePref,
        hardWorking: this.props.hardWorkingPref,
        authenticationToken: this.props.authenticationToken,
        password: this.state.tmpPassword,
        email: this.state.tmpEmail,
        name: this.state.tmpName,
      }),
    })
      .then((response) => response.text())
      /* Then we apply to the local variables for rendering */
      .then((responseJson) => {
        if (responseJson.includes("already exists")) {
          Alert.alert("Failed to update information, please try again!");
          return;
        }
        //console.log(responseJson);
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
        Alert.alert("Updated successfully!");
        /* Render the Profile view again */
        this.setState({ userEdit: false });
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
    console.log("Check NULL: data = " + data);
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

  checkSumPrefs() {
    if (
      this.state.tmpKindness +
      this.state.tmpPatience +
      this.state.tmpHardWorking <
      12
    ) {
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
            <SafeAreaView testID="profileView" style={styles.container}>
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
                testID="profileKindnessInput"
                label="Kindness preference: "
                value={this.props.kindnessPref}
                characterRestriction={2}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpKindness: parseInt(data, 10) })}
              />

              <TextField
                testID="profilePatienceInput"
                label="Patience preference: "
                value={this.props.patiencePref}
                characterRestriction={2}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpPatience: parseInt(data, 10) })}
              />

              <TextField
                testID="profileHardworkingInput"
                label="Hardworking preference: "
                value={this.props.hardWorkingPref}
                characterRestriction={2}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpHardWorking: parseInt(data, 10) })}
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