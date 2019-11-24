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
import BackgroundTimer from "react-native-background-timer";
import { LoginButton, AccessToken } from "react-native-fbsdk";

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

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Input states */
      tmpYearLevel: "",
      tmpCoursesString: "",
      tmpCourses: [],
      tmpSex: "",
      tmpKindnessSelfRate: 4,
      tmpPatienceSelfRate: 4,
      tmpHardWorkingSelfRate: 4,
      tmpUserID: "",
      tmpPassword: "",
      tmpEmail: "",
      tmpName: "",
      tmpAuthenticationToken: "",
      tmpCurrentMatches: [],
      tmpIncomingMatches: [],
      tmpPotentialMatches: [],
      tmpScheduleArray: [],

      tmpSexPref: "",
      tmpYearLevelPref: "",
      tmpCoursesPrefString: "",
      tmpCoursesPref: [],
      tmpKindnessPref: 0,
      tmpPatiencePref: 0,
      tmpHardWorkingPref: 0,

      /* Transition states */
      loginSecureTextEntry: true,
      signUp: false,
    };
  }

  render() {
    if (!this.state.signUp) {
      return (
        <SafeAreaView testID="loginView" style={styles.safeContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navBarTitle}>SE7EN</Text>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.inputContainer}>
              <TextField
                testID="userIDInput"
                label="User ID: "
                title="Please enter User ID as an integer!"
                characterRestriction={10}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={(data) => this.props.userIDChange(data)}
              />

              <TextField
                testID="passwordInput"
                label="Password: "
                clearTextOnFocus={true}
                secureTextEntry={this.state.loginSecureTextEntry}
                renderRightAccessory={this.loginRenderPasswordAccessory()}
                onChangeText={(data) => this.props.passwordChange(data)}
              />
            </View>

            <View style={{
              flexDirection: "column",
              flex: 1,
              alignItems: "stretch",
              justifyContent: "center",
            }}>
              <TextButton
                testID="signInButton"
                style={{
                  margin: 4,
                }}
                titleColor="white"
                color="#4286f4"
                title="Sign In"
                onPress={() => this.signIn()}
              />
              <TextButton
                testID="signUpButton"
                style={{
                  margin: 4,
                }}
                titleColor="white"
                color="cadetblue"
                title="Sign Up"
                onPress={() => this.renderSignUpForm()}
              />
              <LoginButton
                scope={'public_profile email'}
                style={{
                  padding: 15,
                  margin: 4
                }}
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      console.log("login has error: " + result.error);
                      Alert.alert("Facebook login ran into an error\nPlease try again later.");
                    } else if (result.isCancelled) {
                      console.log("login is cancelled.");
                      Alert.alert("Facebook login got cancelled.")
                    } else {
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                          console.log(data.accessToken.toString())
                          this.setState({ tmpAuthenticationToken: data.accessToken.toString() });
                          this.signInAuthToken();
                          /* TODO: handle login with authentication token */
                        }
                      )
                    }
                  }
                }
                onLogoutFinished={() => console.log("logout.")} />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView testID="signUpView" style={styles.safeContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navBarTitle}>Sign up</Text>
          </View>
          <ScrollView
            testID="signUpScrollView"
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.safeContainer}>
              <Text style={{ fontSize: 18, flex: 1, margin: 8, textDecorationLine: "underline" }}>Basic info:</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextField
                testID="signUpUserIDInput"
                label="User ID: "
                characterRestriction={10}
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpUserID: data })}
              />

              <TextField
                testID="signUpPasswordInput"
                label="Password: "
                clearTextOnFocus={true}
                characterRestriction={20}
                secureTextEntry={this.state.loginSecureTextEntry}
                renderRightAccessory={this.loginRenderPasswordAccessory()}
                onChangeText={(data) => this.setState({ tmpPassword: data })}
              />

              <TextField
                testID="signUpNameInput"
                label="Name: "
                clearTextOnFocus={true}
                characterRestriction={30}
                onChangeText={(data) => this.setState({ tmpName: data })}
              />

              <TextField
                testID="signUpEmailInput"
                label="Email: "
                clearTextOnFocus={true}
                characterRestriction={50}
                onChangeText={(data) => this.setState({ tmpEmail: data })}
              />

              <TextField
                testID="signUpSexInput"
                label="Sex: "
                clearTextOnFocus={true}
                characterRestriction={1}
                keyboardType='number-pad'
                title="Please input as an integer (0 - Male, 1 - Female, 2 - Both)"
                onChangeText={(data) => this.setState({ tmpSex: data })}
              />

              <TextField
                testID="signUpYearLevelInput"
                label="Year level: "
                clearTextOnFocus={true}
                characterRestriction={1}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpYearLevel: data })}
              />

              <TextField
                testID="signUpCoursesInput"
                label="Courses: "
                clearTextOnFocus={true}
                title="Please input in form: 'Course A,Course B,Course C'"
                onChangeText={(data) => this.setState({ tmpCoursesString: data })}
              />

              <TextField
                testID="signUpKindnessSelfRateInput"
                label="Kindness self-rating: "
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={data => this.setState({ tmpKindnessSelfRate: parseInt(data, 10) })}
              />

              <TextField
                testID="signUpPatienceSelfRateInput"
                label="Patience self-rating: "
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={data => this.setState({ tmpPatienceSelfRate: parseInt(data, 10) })}
              />

              <TextField
                testID="signUpHardworkingSelfRateInput"
                label="Hardworking self-rating: "
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={data => this.setState({ tmpHardWorkingSelfRate: parseInt(data, 10) })}
              />
            </View>
            <View style={styles.safeContainer}>
              <Text style={{ fontSize: 18, flex: 1, margin: 8, textDecorationLine: "underline" }}>Preferences:</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextField
                testID="signUpSexInput"
                label="Sex: "
                clearTextOnFocus={true}
                characterRestriction={1}
                keyboardType='number-pad'
                title="Please input as an integer (0 - Male, 1 - Female, 2 - Both)"
                onChangeText={(data) => this.setState({ tmpSexPref: data })}
              />

              <TextField
                testID="signUpYearLevelInput"
                label="Year level: "
                clearTextOnFocus={true}
                characterRestriction={1}
                keyboardType='number-pad'
                onChangeText={(data) => this.setState({ tmpYearLevelPref: data })}
              />

              <TextField
                testID="signUpCoursesInput"
                label="Courses: "
                clearTextOnFocus={true}
                title="Please input in form: 'Course A,Course B,Course C'"
                onChangeText={(data) => this.setState({ tmpCoursesPrefString: data })}
              />

              <TextField
                testID="signUpKindnessSelfRateInput"
                label="Kindness preference: "
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={data => this.setState({ tmpKindnessPref: parseInt(data, 10) })}
              />

              <TextField
                testID="signUpPatienceSelfRateInput"
                label="Patience preference: "
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={data => this.setState({ tmpPatiencePref: parseInt(data, 10) })}
              />

              <TextField
                testID="signUpHardworkingSelfRateInput"
                label="Hardworking preference: "
                clearTextOnFocus={true}
                keyboardType='number-pad'
                onChangeText={data => this.setState({ tmpHardWorkingPref: parseInt(data, 10) })}
              />
            </View>

            <View style={{
              lexDirection: "column",
              flex: 1,
              alignItems: "stretch",
              justifyContent: "center",
            }}>
              <TextButton
                testID="sendSignUpRequestButton"
                style={{ margin: 4 }}
                titleColor="white"
                color="#4286f4"
                title="sign up"
                onPress={() => this.signUp()}
              />
              <TextButton
                testID="signUpGoBackButton"
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="go back"
                onPress={() => this.unrenderSignUpForm()}
              />
            </View>
          </ScrollView>
        </SafeAreaView >
      );
    }
  }

  //---------------------------------------------------------------------------//

  /* Helper function that executes the Sign In sequence */
  signIn() {
    /* We first check for error (NULL/empty) */
    var signInCheck = [this.props.userID, this.props.password];
    for (var i = 0; i < signInCheck.length; i++) {
      if (this.checkNULL(signInCheck[i]) || this.checkEmpty(signInCheck[i])) {
        Alert.alert("One of the fields must not be NULL or empty");
        return;
      }
    }

    /* If no errors, we do a fetch */
    let fetchURL = baseURL + "user/" + this.props.userID + "/info";
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
        }
      });
  }

  /* Helper function that executes the Sign Up sequence */
  signUp() {
    /* We first check for error (NULL/empty) */
    var signUpCheck = [this.state.tmpYearLevel, this.state.tmpCoursesString, this.state.tmpSex, this.state.tmpUserID, this.state.tmpPassword, this.state.tmpEmail, this.state.tmpName, this.state.tmpKindnessSelfRate, this.state.tmpPatienceSelfRate, this.state.tmpHardWorkingSelfRate, this.state.tmpSexPref, this.state.tmpYearLevelPref, this.state.tmpCoursesPrefString, this.state.tmpKindnessPref, this.state.tmpPatiencePref, this.state.tmpHardWorkingPref];
    for (var i = 0; i < signUpCheck.length; i++) {
      if (this.checkNULL(signUpCheck[i]) || this.checkEmpty(signUpCheck[i])) {
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

    /* If no errors, we do the request */
    /* Split course string -> array first */
    this.setState({ tmpCourses: this.state.tmpCoursesString.split(",") });
    let fetchURL = baseURL + "user/info";
    console.log("[signUp] url request: " + fetchURL);
    fetch(fetchURL, {
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
        kindness: this.state.tmpKindnessSelfRate,
        patience: this.state.tmpPatienceSelfRate,
        hardWorking: this.state.tmpHardWorkingSelfRate,
        authenticationToken: "",
        userId: this.state.tmpUserID,
        password: this.state.tmpPassword,
        email: this.state.tmpEmail,
        name: this.state.tmpName,
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(responseJson);
        /* Check if user ID already exists or not */
        if (responseJson.includes("already exists")) {
          Alert.alert("User ID already exists!");
        }
        else if (responseJson.includes("Cannot POST")) {
          Alert.alert("Cannot sign up, please try again");
        }
        else {
          this.signUpPreferences();
        }
      });
  }

  signUpPreferences() {
    /* Split course string -> array first */
    this.setState({ tmpCoursesPref: this.state.tmpCoursesPrefString.split(",") });
    let fetchURL = baseURL + "user/" + this.state.tmpUserID + "/preferences";
    console.log("[signUpPreferences] url request: " + fetchURL);
    fetch(fetchURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kindness: this.state.tmpKindnessPref,
        patience: this.state.tmpPatiencePref,
        hardWorking: this.state.tmpHardWorkingPref,
        courses: this.state.tmpCoursesPref,
        sex: this.state.tmpSexPref,
        yearLevel: this.state.tmpYearLevelPref
      }),
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(responseJson);
        /* Check if user ID already exists or not */
        if (responseJson.includes("does not exists")) {
          Alert.alert("User ID already exists!");
        }
        else if (responseJson.includes("Cannot POST")) {
          Alert.alert("Cannot sign up, please try again");
        }
        else {
          Alert.alert("Signed up succesfully")
          this.unrenderSignUpForm();
        }
      });
  }

  signInAuthToken() {
    let fetchURL = baseURL + "user/" + this.state.tmpAuthenticationToken + "/info";
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
          this.signUpAuthToken();
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
              if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
                Alert.alert("Signed in successfully!");
                /* Do the Initialize sequence after signing in successfully */
                this.initSequence();
                this.props.logVisibleChange();
              } else {
                Alert.alert("Cannot sign in with this Facebook account");
                return;
              }
            });
        }
      });
  }

  signUpAuthToken(authToken) {

  }

  /* Helper functions that check whether or not any fields are NULL/empty */
  checkNULL(data) {
    if (typeof data === "undefined") {
      return true;
    }
    else {
      return false;
    }
  }

  checkEmpty(data) {
    if (data === "" || data === []) {
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

  /* Helper function that populates data of user"s info on Init Sequence
   * Assumes that user must be created before calling this function 
   */
  initUserInfo() {
    //console.log("[initUserInfo]")
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
        //console.log("[initUserInfo] " + responseJson)
        if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
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
        else {
          Alert.alert("Could not initialize user's info");
        }
      });
  }

  /* Helper function that populates data of user"s preferences on Init Sequence */
  initUserPreferences() {
    //console.log("[initUserPreferences]")
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
        //console.log("[initUserPreferences] " + responseJson[0].kindness);
        if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
          this.props.kindnessPrefChange(responseJson[0].kindness);
          this.props.patiencePrefChange(responseJson[0].patience);
          this.props.hardWorkingPrefChange(responseJson[0].hardWorking);
          this.props.coursesPrefChange(responseJson[0].courses);
          this.props.sexPrefChange(responseJson[0].sex);
          this.props.yearLevelPrefChange(responseJson[0].yearLevel);
        }
        else {
          Alert.alert("Could not initialize user's preferences");
        }
      });
  }

  /* Helper function that populates data of user"s schedule on Init Sequence */
  initUserSchedule() {
    //console.log("[initUserSchedule]")
    let fetchURL = baseURL + "schedule/" + this.props.userID;
    //console.log("[initUserSchedule] fetchURL: " + fetchURL);
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
        //console.log(responseJson);
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
                this.props.scheduleArrayClear();
                /* Traverse through each item to populate needed fields of scheduleArray for rendering */
                var i;
                for (i = 0; i < responseJson.length; i++) {
                  /* Start time of a schedule */
                  var item = responseJson[i];
                  var startTimeToAdd = new Date(item.date);
                  startTimeToAdd.setHours(item.time.substring(0, 2));
                  startTimeToAdd.setMinutes(item.time.substring(3, 5));
                  /* End time of a schedule */
                  var endTimeToAdd = new Date(item.date);
                  endTimeToAdd.setHours(item.time.substring(6, 8));
                  endTimeToAdd.setMinutes(item.time.substring(9, 11));
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
                  this.state.tmpScheduleArray.push(tmpSchedule);
                };
                /* Update event ID accordingly */
                this.props.eventIDChange(responseJson[responseJson.length - 1].eventId);
                this.initUserMatches();
              }
              else {
                Alert.alert("Could not initialize user's schedule");
              }
            });
        }
      });
  }

  /* Helper function that populates data of user's matches on Init Sequence */
  initUserMatches() {
    // var i;
    // for (i = 0; i < this.state.tmpScheduleArray.length; i++) {
    //   let fetchURL = baseURL + "user/" + this.props.userID + "/matches/potentialMatches/" + this.state.tmpScheduleArray[i].id;
    //   //console.log("[initUserMatches] fetchURL: " + fetchURL);
    //   fetch(fetchURL, {
    //     method: "GET",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //   })
    //     /* First check if user, especially newly created ones have any schedules to initialize */
    //     .then((response) => response.text())
    //     .then((responseJson) => {
    //       //console.log("[initUserMatches] responseJson: " + responseJson);
    //       if (responseJson.includes("doesn't have any")) {
    //         return;
    //       }
    //       else {
    //         /* Otw, we do the actual fetch */
    //         fetch(fetchURL, {
    //           method: "GET",
    //           headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //           },
    //         })
    //           .then((response) => response.json())
    //           .then((responseJson) => {
    //             if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
    //               this.props.currentMatchesClear();
    //               /* Traverse through each  */
    //               if (responseJson[0].match === -1) {
    //                 console.log("No current match for event");
    //               }
    //               else {
    //                 var tmpMatch = {
    //                   name: "User " + "A",
    //                   avatar_url: "https://i.redd.it/q5d5fkvzqem31.jpg",
    //                   subtitle: "User ID: " + 10101 + " in event ID: " + 99999,
    //                 };
    //                 this.props.currentMatchesAdd(tmpMatch);
    //               }
    //             }
    //           });
    //       }
    //     });
    // }
  }

  /* Init Sequence after successully signing in */
  initSequence() {
    this.initUserSchedule();
    this.initUserInfo();
    this.initUserPreferences();
    /* Start a timer for checking potential matches notify user using Push Notification */
    BackgroundTimer.runBackgroundTimer(() => {
      let url =
        baseURL + 'user/:' + this.props.user_id + '/matches/potential_matches';
      fetch(url, {
        method: 'GET',
      })
        .then(response => response.text()) // CHECK THIS LATER
        .then(responseJson => {
          /* Gotta check if the potential matches change or not */
          if (this.checkNULL(responseJson[0].potential_matches) || this.checkEmpty(responseJson[0].potential_matches) || responseJson[0].potential_matches === this.state.tmpPotentialMatches) {
            console.log("In if");
            return;
          }
          /* If they do, we send a push notification and change the current potential matches array */
          else {
            console.log("In else");
            this.setState({ tmpPotentialMatches: responseJson[0].potential_matches });
            this.props.push_noti.localNotif(responseJson[0].potential_matches, responseJson[0].event_id, responseJson[0].time, responseJson[0].date);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }, 10000); /* This is in miliseconds. We repeat this for every 10 seconds. Can be a smaller time interval as well */
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
}
