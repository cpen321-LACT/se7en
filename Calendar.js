"use strict";

import React from "react";
import WeekView, { addLocale } from "react-native-week-view";
import {
  StyleSheet,
  Text,
  Alert,
  View,
  StatusBar,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";
import { TextField } from "react-native-material-textfield";
import { TextButton } from "react-native-material-buttons";

/* -------------------------------------------------------------------------- */
/* Styles */
const fontFamily = Platform.OS === "ios" ? "Avenir" : "sans-serif";
const statusBarHeight = Platform.OS === "ios" ? 35 : 0;

const styles = StyleSheet.create({
  container_calendar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  header_calendar: {
    backgroundColor: "#4286f4",
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
  scroll: {
    backgroundColor: "transparent",
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
    backgroundColor: "white",
  },
});

/* -------------------------------------------------------------------------- */

/* Fields for rendering week view */
addLocale("en", {
  months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
    "_"
  ),
  monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sept_Oct_Nov_Dec".split("_"),
  weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
    "_"
  ),
  weekdaysShort: "Sun_Mon_Tue_Wed_Thur_Fri_Sat".split("_"),
});

export const baseURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/"
    : "http://localhost:3000/";

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Input states */
      tmpId: 0,
      tmpColor: "rgba(66,134,244,1)",
      tmpDate: "0",
      tmpStartTimeString: "",
      tmpStartTime: new Date(),
      tmpEndTimeString: "",
      tmpEndTime: new Date(),
      tmpSubject: "",
      tmpLocation: "",
      /* Transition states */
      error: false,
      userEdit: false,
      calendarRefreshing: false,
    };
  }

  /* Add a schedule object to the backend */
  addSchedule() {
    /* First check for error (NULL/empty) */
    this.checkScheduleUndefined();
    this.checkScheduleEmpty();
    if (!this.state.error) {
      let fetchURL = baseURL + "user/:" + this.props.userID + "/schedule";

      /* Start time */
      var eventStart = new Date();
      eventStart.setUTCDate(eventStart.getUTCDate() + parseInt(this.state.tmpDate, 10) - 1);
      var tempTime = this.state.tmpStartTimeString.split(" ");
      eventStart.setHours(parseInt(tempTime[0], 10), parseInt(tempTime[1], 10));

      /* End time */
      var eventEnd = new Date();
      eventEnd.setUTCDate(eventEnd.getUTCDate() + parseInt(this.state.tmpDate, 10) - 1);
      var tempTime2 = this.state.tmpEndTimeString.split(" ");
      eventEnd.setHours(parseInt(tempTime2[0], 10), parseInt(tempTime2[1], 10));

      /* Setting the temporary states */
      this.setState({ tmpStartTime: eventStart });
      this.setState({ tmpEndTime: eventEnd });

      /* Create a temporary schedule obj */
      var tmp = {
        id: this.state.tmpId,
        startDate: this.state.tmpStartTime,
        endDate: this.state.tmpEndTime,
        color: this.state.tmpColor,
        description: this.state.tmpSubject,
        subject: this.state.tmpSubject,
        location: this.state.tmpLocation,
      };

      /* Add it to the local scheduleArray for rendering */
      this.props.scheduleArrayAdd(tmp);

      /* Increase the event ID */
      this.setState({ tmpId: this.state.tmpId + 1 });

      /* Post the schedle obj to the database */
      fetch(fetchURL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: this.props.userID,
          event_id: this.state.tmpId,
          time: this.state.tmpStartTimeString + "-" + this.state.tmpEndTimeString,
          date:
            this.state.tmpStartTime.getUTCMonth() +
            1 +
            "/" +
            this.state.tmpStartTime.getUTCDate() +
            "/" +
            this.state.tmpStartTime.getUTCFullYear(),
          course: this.state.tmpSubject,
          location: this.state.tmpLocation,
        }),
      })
        .then((response) => response.text())
        .then((responseJson) => {
          //console.log(responseJson);
          Alert.alert("Added schedule successfully!");
          this.setState({ userEdit: false });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  /* Helper functions that check whether or not any fields are NULL/empty */
  checkScheduleUndefined() {
    this.setState({ error: false });
    if (
      typeof this.state.tmpColor === "undefined" ||
      typeof this.state.tmpDate === "undefined" ||
      typeof this.state.tmpStartTimeString === "undefined" ||
      typeof this.state.tmpEndTimeString === "undefined" ||
      typeof this.state.tmpSubject === "undefined" ||
      typeof this.state.tmpLocation === "undefined"       
    ) {
      this.setState({ error: true });
      Alert.alert("One of the fields cannot be empty!");
    }
  }
  checkScheduleEmpty() {
    this.setState({ error: false });
     if (
      this.state.tmpColor === "" ||
      this.state.tmpDate === "" ||
      this.state.tmpStartTimeString === "" ||
      this.state.tmpEndTimeString === "" ||
      this.state.tmpSubject === "" ||
      this.state.tmpLocation === ""
    ) {
      this.setState({ error: true });
      Alert.alert("One of the fields cannot be empty!");
    }
  
  }

  /* Function that shows all the possible matches of an user */
  getMatches() {
    let url =
      baseURL + "user/:" + this.props.userID + "/matches/potential_matches";
    //console.log(url);
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.text())
      .then((responseJson) => {
        //console.log(responseJson[0].potential_matches);
        Alert.alert(
          "Potential matches:\n" + responseJson[0].potential_matches
        );
      })
      .catch(error => {
        console.error(error);
      });
  }


  /* Function handling refreshes */
  _onRefresh = () => {
    this.setState({ calendarRefreshing: true });
    this.refreshSchedule();
    this.setState({ calendarRefreshing: false });
  };

  /* Function that refreshes schedule array */
  refreshSchedule() {
    let fetchURL = baseURL + "schedule/:" + this.props.userID;
    fetch(fetchURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.text())
      .then((responseJson) => {
        /* First check if user has any schedule to fetch or not */
        if (responseJson.includes("doesn't have any")) {
          return;
        }
        else {
          /* If not, we do the actual fetch */
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
                this.props.scheduleArrayClear();
                responseJson.forEach(item => {
                  var startTimeToAdd = new Date(item.date);
                  startTimeToAdd.setHours(item.time.substring(0, 2));
                  startTimeToAdd.setMinutes(item.time.substring(3, 5));
                  var endTimeToAdd = new Date(item.date);
                  endTimeToAdd.setHours(item.time.substring(7, 9));
                  endTimeToAdd.setMinutes(item.time.substring(9, 13));
                  var tmpSchedule = {
                    id: item.event_id,
                    startDate: startTimeToAdd,
                    endDate: endTimeToAdd,
                    color: "rgba(66,134,244,1)",
                    description: item.course,
                    subject: item.course,
                    location: item.location,
                  };
                  this.props.scheduleArrayAdd(tmpSchedule);
                });
                //console.log(this.props.scheduleArray);
              } else {
                // Do nothing
              }
            })
            .catch(error => {
              console.error(error);
            });
        }
      })
  }


  /* Helper functions for (un)rendering user input forms */
  renderUserform() {
    this.setState({ userEdit: true });
    //console.log("userform requested!");
  }

  unrenderUserform() {
    this.setState({ userEdit: false });
    //console.log("go back!");
  }

  /* -------------------------------------------------------------------------- */

  render() {
    if (!this.state.userEdit) {
      return (
        <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
          {
            <SafeAreaView style={styles.container}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.calendarRefreshing}
                    onRefresh={this._onRefresh}
                  />
                }>
                <View style={styles.container_calendar}>
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor="#4286f4"
                  />
                  <View style={styles.navBar}>
                    <Text style={styles.navBarTitle}>Calendar</Text>
                  </View>

                  <WeekView
                    events={this.props.scheduleArray}
                    selectedDate={new Date()}
                    numberOfDays={7}
                    onEventPress={event =>
                      Alert.alert(
                        "Event: " + event.id,
                        "Time: " +
                        event.startDate.getHours() +
                        ":" +
                        event.startDate.getMinutes() +
                        " - " +
                        event.endDate.getHours() +
                        ":" +
                        event.endDate.getMinutes() +
                        "\nDate: " +
                        (event.startDate.getUTCMonth() + 1) +
                        "/" +
                        event.startDate.getUTCDate() +
                        "/" +
                        event.startDate.getUTCFullYear() +
                        "\nSubject: " +
                        event.subject +
                        "\nLocation: " +
                        event.location
                      )
                    }
                    headerStyle={styles.header_calendar}
                    formatDateHeader="ddd D"
                    locale="en"
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          }
          <ActionButton buttonColor="rgba(66,134,244,1)">
            <ActionButton.Item
              buttonColor="rgba(66,134,244,1)"
              title="New Schedule"
              onPress={() => this.renderUserform()}>
              <Icon name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="rgba(66,134,244,1)"
              title="Get Matches"
              onPress={() => this.getMatches()}>
              <Icon
                name="md-person-add"
                style={styles.actionButtonIcon}
              />
            </ActionButton.Item>
          </ActionButton>
        </View>
      );
    } else {
      return (
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navBarTitle}>Add to Calendar</Text>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.input_container}>
              <TextField
                label="Date: "
                value={""}
                title="Enter 1 - 7 (1 = TODAY, 7 = LAST DAY OF WEEK)"
                characterRestriction={1}
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpDate: data })}
              />
              <TextField
                label="Start Time: "
                value={""}
                title="Enter in form 'hh mm'"
                characterRestriction={5}
                clearTextOnFocus={true}
                onChangeText={data =>
                  this.setState({ tmpStartTimeString: data })
                }
              />

              <TextField
                label="End Time: "
                value={""}
                title="Enter in form 'hh mm'"
                characterRestriction={5}
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpEndTimeString: data })}
              />
              <TextField
                label="Subject: "
                value={""}
                title="This is a required field or it would show CPEN 321 by default"
                clearTextOnFocus={true}
                characterRestriction={10}
                onChangeText={data => this.setState({ tmpSubject: data })}
              />

              <TextField
                label="Location: "
                value={""}
                clearTextOnFocus={true}
                characterRestriction={20}
                onChangeText={data => this.setState({ tmpLocation: data })}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
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
                title="add"
                onPress={() => this.addSchedule()}
              />

              {/* <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="log"
                onPress={() => console.log(this.state.tmpSubject)}
              /> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
