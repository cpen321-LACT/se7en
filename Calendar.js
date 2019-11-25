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
  Platform
} from "react-native";
import ActionButton from "react-native-action-button";
import { TextField } from "react-native-material-textfield";
import { TextButton } from "react-native-material-buttons";
import { Picker, DatePicker } from 'react-native-wheel-datepicker';
/* -------------------------------------------------------------------------- */
/* Styles */
const fontFamily = Platform.OS === "ios" ? "Avenir" : "sans-serif";
const statusBarHeight = Platform.OS === "ios" ? 35 : 0;

const styles = StyleSheet.create({
  containerCalendar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  headerCalendar: {
    backgroundColor: "rgba(25,110,227,0.5)",
  },
  navBar: {
    backgroundColor: "rgba(25,110,227,0.7)",
    height: 44 + statusBarHeight,
    alignSelf: "stretch",
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
  safeContainer2: {
   flex: 1,
   backgroundColor: "rgba(211,211,211,1)",
 }
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

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Input states */
      tmpColor: "rgba(66,134,244,1)",
      tmpDate: "",
      tmpStartTime: new Date(),
      tmpEndTime: new Date(),
      tmpSubject: "",
      tmpLocation: "",
      /* Transition states */
      userEdit: false,
      calendarRefreshing: false,
    };
  }

  /* Add a schedule object to the backend */
  addSchedule() {
    /* First check for errors (NULL/empty) */
    var toCheck = [this.state.tmpDate, this.state.tmpStartTime, this.state.tmpEndTime, this.state.tmpSubject, this.state.tmpLocation];
    for (var i = 0; i < toCheck.length; i++) {
      if (this.checkNULL(toCheck[i]) || this.checkEmpty(toCheck[i])) {
        Alert.alert("One of the fields must not be NULL or empty");
        return;
      }
    }

    let fetchURL = baseURL + "schedule/" + this.props.userID;
    console.log("[addSchedule] fetchURL: " + fetchURL);

    /* Start time */
    var eventStart = new Date();
    eventStart.setUTCDate(eventStart.getUTCDate() + parseInt(this.state.tmpDate, 10) - 1);
    eventStart.setUTCHours(tmpStartTime.getUTCHours(), tmpStartTime.getUTCMinutes());


    /* End time */
    var eventEnd = new Date();
    eventEnd.setUTCDate(eventEnd.getUTCDate() + parseInt(this.state.tmpDate, 10) - 1);
    eventEnd.setUTCHours(tmpEndTime.getUTCHours(), tmpEndTime.getUTCMinutes());

    /* Setting the temporary states */
    this.setState({ tmpStartTime: eventStart });
    this.setState({ tmpEndTime: eventEnd });

    /* Increase the event ID and update accordingly */
    this.props.eventIDChange(this.props.eventID + 1);


    /* Create a temporary schedule obj */
    var tmp = {
      id: this.props.eventID,
      startDate: this.state.tmpStartTime,
      endDate: this.state.tmpEndTime,
      color: this.state.tmpColor,
      description: this.state.tmpSubject,
      subject: this.state.tmpSubject,
      location: this.state.tmpLocation,
    };

    /* Post the schedle obj to the database */
    fetch(fetchURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: this.props.userID,
        eventId: this.props.eventID,
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
        console.log(responseJson);
        if (responseJson.includes("doesn't exist")) {
          Alert.alert("Cannot upload schedule, please try again");
        }
        else if (responseJson.includes("Cannot POST")) {
          Alert.alert("Cannot upload schedule, please try again");
        }
        else {
          /* Add it to the local scheduleArray for rendering */
          this.props.scheduleArrayAdd(tmp);
          Alert.alert("Added schedule successfully!");
          this.unrenderUserform();
        }
      });
  }

  /* Helper functions that check whether or not any fields are NULL/empty */
  checkNULL(data) {
    console.log("checkNULL typeof data: " + typeof data);
    return (typeof data === "undefined")? true : false;
  }

  checkEmpty(data) {
    if (data === "") {
      //console.log("data is empty");
      return true;
    }
    else {
      //console.log("data is not empty");
      return false;
    }
  }

  /* -------------------------------------------------------------------------- */

  /* Functions handling refreshes */
  _onRefresh = () => {
    this.refreshSchedule();
  };

  refreshSchedule() {
    this.setState({ calendarRefreshing: true });
    let fetchURL = baseURL + "schedule/" + this.props.userID;
    console.log("[refreshSchedule] fetchURL: " + fetchURL);
    fetch(fetchURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(responseJson);
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
                responseJson.forEach((item) => {
                  var startTimeToAdd = new Date(item.date);
                  startTimeToAdd.setHours(item.time.substring(0, 2));
                  startTimeToAdd.setMinutes(item.time.substring(3, 5));
                  var endTimeToAdd = new Date(item.date);
                  endTimeToAdd.setHours(item.time.substring(6, 8));
                  endTimeToAdd.setMinutes(item.time.substring(9, 11));
                  var tmpSchedule = {
                    id: item.eventId,
                    startDate: startTimeToAdd,
                    endDate: endTimeToAdd,
                    color: "rgba(66,134,244,1)",
                    description: item.course,
                    subject: item.course,
                    location: item.location,
                  };
                  this.props.scheduleArrayAdd(tmpSchedule);
                });
                /* Update event ID accordingly */
                this.props.eventIDChange(responseJson[responseJson.length - 1].eventId);
                console.log("Updated event ID: " + this.props.eventID);
              }
            });
        }
      });
    this.setState({ calendarRefreshing: false });
  }


  /* Helper functions for (un)rendering user input forms */
  renderUserform() {
    this.setState({ userEdit: true });
  }

  unrenderUserform() {
    this.setState({ userEdit: false });
  }

  /* -------------------------------------------------------------------------- */

  render() {
    if (!this.state.userEdit) {
      return (
        <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
          {
            <SafeAreaView testID="calendarView" style={styles.container}>
              <ScrollView
                testID="calendarScrollView"
                refreshControl={
                  <RefreshControl
                    testID="calendarRefresh"
                    refreshing={this.state.calendarRefreshing}
                    onRefresh={this._onRefresh}
                  />
                }>
                <View style={styles.containerCalendar}>
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(25,110,227,1)"
                  />
                  <View style={styles.navBar}>
                    <Text style={styles.navBarTitle}>Calendar</Text>
                  </View>

                  <WeekView
                    events={this.props.scheduleArray}
                    selectedDate={new Date()}
                    numberOfDays={7}
                    onEventPress={(event) =>
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
                    headerStyle={styles.headerCalendar}
                    formatDateHeader="ddd D"
                    locale="en"
                  />
                </View>
              </ScrollView>
            </SafeAreaView>
          }
          <ActionButton
            testID="calendarMainButton"
            buttonColor="crimson"
            onPress={() => this.renderUserform()}>>
          </ActionButton>
        </View>
      );
    } else {
      return (
        <SafeAreaView testID="calendarAddView" style={styles.safeContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navBarTitle}>Add to Calendar</Text>
          </View>
          <ScrollView
            testID="calendarAddScrollView"
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.inputContainer}>
            <Text style={{margin: 4, color: "black", textAlign: 'center'}}>
              Date:{this.state.tmpDate}
            </Text>
            <Picker
              style={{ flex: 1 }}
              selectedValue={this.state.tmpDate}
              textSize={16}
              backgroundColor="white"
              style={{width: '100%', height: 100}}
              pickerData={[1, 2, 3, 4, 5, 6, 7]}
              onValueChange={value => this.setState({ tmpDate:value })}
            />
            <Text style={{margin: 4, color: "black", textAlign: 'center'}}>
              Start time:{this.state.tmpStartTime.getHours()}:{this.state.tmpStartTime.getMinutes()}
            </Text>
            <DatePicker
              date={this.state.tmpStartTime}
              mode="time"
              backgroundColor="white"
              textSize={16}
              style={{width: '100%', height: 100}}
              onDateChange={time => this.setState({ tmpStartTime:time })}
            />
            <Text style={{margin: 4, color: "black", textAlign: 'center'}}>
              End time:{this.state.tmpEndTime.getHours()}:{this.state.tmpEndTime.getMinutes()}
            </Text>
            <DatePicker
              date={this.state.tmpEndTime}
              mode="time"
              backgroundColor="white"
              textSize={16}
              style={{width: '100%', height: 100}}
              onDateChange={time => this.setState({ tmpEndTime: time })}
            />
            <TextField
              label="Subject: "
              value={""}
              textColor="black"
              baseColor="black"
              clearTextOnFocus={true}
              characterRestriction={10}
              onChangeText={(data) => this.setState({ tmpSubject: data })}
            />
            <TextField
              label="Location: "
              value={""}
              textColor="black"
              clearTextOnFocus={true}
              characterRestriction={20}
              onChangeText={(data) => this.setState({ tmpLocation: data })}
            />
            </View>

            <View style={{
              flexDirection: "column",
              flex: 1,
              alignItems: "stretch",
              justifyContent: "center",
            }}>
              <TextButton
                testID="calendarAddButton"
                style={{ margin: 4 }}
                titleColor="white"
                color="black"
                title="add schedule"
                onPress={() => this.addSchedule()}
              />
              <TextButton
                testID="calendarGoBackButton"
                style={{ margin: 4 }}
                titleColor="white"
                color="black"
                title="go back"
                onPress={() => this.unrenderUserform()}
              />
              {/* <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="log"
                onPress={() => console.log(this.props.eventID)}
              /> */}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
