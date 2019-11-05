"use strict";

/* Login view of the app */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { TextField } from "react-native-material-textfield";
import { TextButton } from "react-native-material-buttons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

/* -------------------------------------------------------------------------- */
/* Styles */
const statusBarHeight = Platform.OS === "ios" ? 35 : 0;
const fontFamily = Platform.OS === "ios" ? "Avenir" : "sans-serif";

const styles = StyleSheet.create({
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
});

/* -------------------------------------------------------------------------- */

export const baseURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/"
    : "http://localhost:3000/";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Input states */
      tmpYearLevel: "",
      tmpCoursesString: "",
      tmpCourses: [],
      tmpSex: "",
      tmpKindness: "4",
      tmpPatience: "4",
      tmpHardWorking: "4",
      tmpUserID: "",
      tmpPassword: "",
      tmpEmail: "",
      tmpName: "",

      /* Transition states */
      loginSecureTextEntry: true,
      error: false,
      signUp: false,
    };
  }

  /* Helper function that executes the Sign In sequence */
  signIn() {
    /* We first check for error (NULL/empty) */
    var signInCheck = [this.props.userID, this.props.password];
    signInCheck.forEach((item) => {
      this.checkEmpty(item);
      this.checkNULL(item);
    });

    /* If no errors, we do a fetch */
    if (!this.state.error) {
      let fetchURL = baseURL + "user/:" + this.props.userID + "/info";
      fetch(fetchURL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        /* First check if this user ID exists or not */
        .then((response) => response.text())
        .then((responseJson) => {
          if (responseJson.includes("does not exist")) {
            Alert.alert("User ID does not exist");
            return;
          } else {
            /* If user ID does exist, we do the actual call */
            fetch(fetchURL, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((responseJson) => {
                /* Then check if the data got from database matches the password typed */
                if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined"
                  && responseJson[0].password === this.props.password) {
                  Alert.alert("Signed in successfully!");
                  /* Do the Initialize sequence after signing in successfully */
                  this.initSequence();
                  this.props.logVisibleChange();
                } else {
                  Alert.alert("Incorrect user ID or password!");
                  return;
                }
              });
            // .catch((error) => {
            //   console.error(error);
            // });
          }
        });
    }
    else {
      Alert.alert("One of the fields must not be NULL or empty");
    }
  }

  /* Helper function that executes the Sign Up sequence */
  signUp() {
    /* We first check for error (NULL/empty) */
    var signUpCheck = [this.state.tmpYearLevel, this.state.tmpCoursesString, this.state.tmpSex, this.state.tmpUserID, this.state.tmpPassword, this.state.tmpEmail, this.state.tmpName];
    signUpCheck.forEach((item) => {
      this.checkEmpty(item);
      this.checkNULL(item);
    });

    /* Check for sum of prefs */
    this.checkSumPrefs();

    /* If no errors, we do the request */
    if (!this.state.error) {
      /* Split course string -> array first */
      this.setState({ tmpCourses: this.state.tmpCoursesString.split(",") });
      let fetchURL = baseURL + "user/:" + this.props.userID;
      fetch(fetchURL, {/* Split course string -> array first */
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          yearLevel: this.state.tmpYearLevel,
          courses: this.state.tmpCourses,
          sex: this.state.tmpSex,
          numberOfRatings: "0",
          kindness: this.state.tmpKindness,
          patience: this.state.tmpPatience,
          hardWorking: this.state.tmpHardWorking,
          authenticationToken: "",
          password: this.state.tmpPassword,
          email: this.state.tmpEmail,
          name: this.state.tmpName,
        }),
      })
        .then((response) => response.text())
        .then((responseJson) => {
          //console.log(responseJson);
          /* Check if user ID already exists or not */
          if (responseJson.includes("already exists")) {
            Alert.alert("User ID already exists!");
          } else {
            Alert.alert("Signed up successfully!");
            this.unrenderSignUpForm();
          }
        });
      // .catch((error) => {
      //   console.error(error);
      // });
    }
    else {
      Alert.alert("One of the fields must not be NULL or empty");
    }
  }

  /* Helper functions that check whether or not any fields are NULL/empty */
  checkNULL(data) {
    if (typeof data === "undefined") {
      this.setState({ error: true });
    }
    else {
      this.setState({ error: false });
    }
  }

  checkEmpty(data) {
    if (data === "") {
      this.setState({ error: true });
    }
    else {
      this.setState({ error: false });
    }
  }

  checkSumPrefs() {
    if (this.state.tmpKindness + this.state.tmpPatience + this.state.tmpHardWorking < 12) {
      this.setState({ error: true });
      Alert.alert(
        "The sum of Kindness, Patience and Hardworking must be at least 12"
      );
    }
    else {
      this.setState({ error: false });
    }
  }

  /* -------------------------------------------------------------------------- */

  /* Helper function that populates data of user"s info on Init Sequence
   * Assumes that user must be created before calling this function 
   */
  initUserInfo() {
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
        //console.log("initUserInfo: " + responseJson)
        if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
          this.props.yearLevelChange(responseJson[0].yearLevel);
          this.props.coursesChange(responseJson[0].courses);
          this.props.sexChange(responseJson[0].sex);
          this.props.numberOfRatingsChange(
            responseJson[0].numberOfRatings
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
        } else {
          // Do nothing
        }
      });
    // .catch((error) => {
    //   console.error(error);
    // });
  }

  /* Helper function that populates data of user"s schedule on Init Sequence */
  initUserSchedule() {
    let fetchURL = baseURL + "schedule/:" + this.props.userID;
    fetch(fetchURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      /* First check if user, especially newly created ones have any schedules to initialize */
      .then((response) => response.text())
      .then((responseJson) => {
        if (responseJson.includes("doesn't have any")) {
          return;
        }
        else {
          /* Otw, we do the actual fetch */
          fetch(fetchURL, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((responseJson) => {
              if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
                /* Debug print */
                //console.log("initUserSchedule: " + responseJson);

                this.props.scheduleArrayClear();
                /* Traverse through each item to populate needed fields of scheduleArray for rendering */
                responseJson.forEach((item) => {
                  /* Start time of a schedule */
                  var startTimeToAdd = new Date(item.date);
                  startTimeToAdd.setHours(item.time.substring(0, 2));
                  startTimeToAdd.setMinutes(item.time.substring(3, 5));
                  /* End time of a schedule */
                  var endTimeToAdd = new Date(item.date);
                  endTimeToAdd.setHours(item.time.substring(7, 9));
                  endTimeToAdd.setMinutes(item.time.substring(9, 12));
                  /* Schedule obj to add to scheduleArray */
                  var tmpSchedule = {
                    id: item.eventId,
                    startDate: startTimeToAdd,
                    endDate: endTimeToAdd,
                    color: "rgba(66,134,244,1)",
                    description: item.course,
                    subject: item.course,
                    location: item.location,
                  };
                  /* Now we add this schedule obj to scheduleArray */
                  this.props.scheduleArrayAdd(tmpSchedule);
                });
                //console.log(this.props.scheduleArray);
              } else {
                // Do nothing
              }
            });
          // .catch((error) => {
          //   console.error(error);
          // });
        }
      });
  }

  /* Init Sequence after successully signing in */
  async initSequence() {
    this.initUserSchedule();
    this.initUserInfo();
  }

  /* Helper functions for un/rendering the Sign Up form */
  renderSignUpForm() {
    this.setState({ signUp: true });
  }

  unrenderSignUpForm() {
    this.setState({ signUp: false });
  }

  /* Helper functions for printing password */
  onAccessoryPress() {
    this.setState({ loginSecureTextEntry: !this.state.loginSecureTextEntry });
  }

  loginRenderPasswordAccessory() {
    let name = this.state.loginSecureTextEntry
      ? "visibility"
      : "visibility-off";

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

  /* -------------------------------------------------------------------------- */

  render() {
    if (!this.state.signUp) {
      return (
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navBarTitle}>SE7EN</Text>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.inputContainer}>
              <TextField
                label="User ID: "
                title="Please enter User ID as an integer!"
                characterRestriction={10}
                clearTextOnFocus={true}
                onChangeText={(data) => this.props.userIDChange(data)}
              />

              <TextField
                label="Password: "
                clearTextOnFocus={true}
                secureTextEntry={this.state.loginSecureTextEntry}
                renderRightAccessory={this.loginRenderPasswordAccessory()}
                onChangeText={(data) => this.props.passwordChange(data)}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="Sign In"
                onPress={() => this.signIn()}
              />
              <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="Sign Up"
                onPress={() => this.renderSignUpForm()}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navBarTitle}>Sign up</Text>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.inputContainer}>
              <TextField
                label="Year level: "
                clearTextOnFocus={true}
                characterRestriction={1}
                onChangeText={(data) => this.setState({ tmpYearLevel: data })}
              />
              <TextField
                label="Courses: "
                clearTextOnFocus={true}
                title="Please input in form: 'Course A,Course B,Course C'"
                onChangeText={(data) => this.setState({ tmpCoursesString: data })}
              />

              <TextField
                label="Sex: "
                clearTextOnFocus={true}
                characterRestriction={1}
                title="Please input as an integer (0 - Male, 1 - Female, 2 - Both)"
                onChangeText={(data) => this.setState({ tmpSex: data })}
              />

              {/* <TextField
                label="Kindness preference: "
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpKindness: data })}
              />

              <TextField
                label="Patience preference: "
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpPatience: data })}
              />

              <TextField
                label="Hardworking preference: "
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpHardWorking: data })}
              /> */}

              <TextField
                label="User ID: "
                characterRestriction={10}
                clearTextOnFocus={true}
                onChangeText={(data) => this.setState({ tmpUserID: data })}
              />

              <TextField
                label="Password: "
                clearTextOnFocus={true}
                characterRestriction={20}
                secureTextEntry={this.state.loginSecureTextEntry}
                renderRightAccessory={this.loginRenderPasswordAccessory()}
                onChangeText={(data) => this.setState({ tmpPassword: data })}
              />

              <TextField
                label="Email: "
                clearTextOnFocus={true}
                characterRestriction={50}
                onChangeText={(data) => this.setState({ tmpEmail: data })}
              />

              <TextField
                label="Name: "
                clearTextOnFocus={true}
                characterRestriction={30}
                onChangeText={(data) => this.setState({ tmpName: data })}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="go back"
                onPress={() => this.unrenderSignUpForm()}
              />
              <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="sign up"
                onPress={() => this.signUp()}
              />
            </View>
          </ScrollView>
        </SafeAreaView >
      );
    }
  }
}
