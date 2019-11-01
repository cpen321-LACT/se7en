'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View,
  StatusBar,
  Image,
  Platform,
  RefreshControl,
  Switch,
  SafeAreaView,
  ScrollView,
  Picker,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { TextButton } from 'react-native-material-buttons';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/'
    : 'http://localhost:3000/';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      scheduleData: [],
      login_secureTextEntry: true,
      error: false,
      signUp: false,
      tmpYearLevel: '',
      tmpCourses: [],
      tmpSex: '',
      tmpKindness: '',
      tmpPatience: '',
      tmpHardWorking: '',
      tmpUser_id: '',
      tmpPassword: '',
      tmpEmail: '',
      tmpName: '',
    };
  }

  signIn() {
    this.checkErrorSignIn();
    if (this.state.error === false) {
      let fetchURL = baseURL + 'user/:' + this.props.user_id + '/info';
      fetch(fetchURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.text())
        .then(responseJson => {
          if (responseJson.includes('does not exist')) {
            Alert.alert('User ID does not exist');
            return;
          } else {
            fetch(fetchURL, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            })
              .then(response => response.json())
              .then(responseJson => {
                console.log(responseJson);
                if (typeof responseJson !== 'undefined') {
                  this.setState({ data: responseJson });
                  if (
                    typeof this.state.data[0] !== 'undefined' &&
                    this.state.data[0].password === this.props.password
                  ) {
                    Alert.alert('Login successfully!');
                    this.initSequence();
                    this.props.logVisibleChange();
                  } else {
                    Alert.alert('Incorrect user ID or password!');
                    return;
                  }
                } else {
                  Alert.alert('Incorrect user ID or password!');
                  return;
                }
              });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  signUp() {
    this.checkErrorSignUp();
    if (this.state.error === false) {
      let fetchURL = baseURL + 'user/:' + this.props.user_id;
      fetch(fetchURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year_level: this.state.tmpYearLevel,
          courses: this.state.tmpCourses,
          sex: this.state.tmpSex,
          number_of_ratings: '0',
          kindness: this.state.tmpKindness,
          patience: this.state.tmpPatience,
          hard_working: this.state.tmpHardWorking,
          authentication_token: '',
          password: this.state.tmpPassword,
          email: this.state.tmpEmail,
          name: this.state.tmpName,
        }),
      })
        .then(response => response.text())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.includes('already exists')) {
            Alert.alert('User ID already exists!');
          } else {
            Alert.alert('Signed up successfully!');
            this.unrenderSignUpForm();
          }
        });
    }
  }

  checkErrorSignIn() {
    if (
      typeof this.props.user_id === 'underfined' ||
      typeof this.props.password === 'undefined' ||
      this.props.user_id === '' ||
      this.props.password === ''
    ) {
      this.setState({ error: true });
      Alert.alert('User ID and password should not be empty');
    } else {
      this.setState({ error: false });
    }
  }

  checkErrorSignUp() {
    if (
      typeof this.state.tmpYearLevel === 'undefined' ||
      this.state.tmpYearLevel === '' ||
      typeof this.state.tmpCourses === 'undefined' ||
      this.state.tmpCourses === [] ||
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
      typeof this.state.tmpUser_id === 'undefined' ||
      this.state.tmpUser_id === '' ||
      typeof this.state.tmpEmail === 'undefined' ||
      this.state.tmpEmail === '' ||
      typeof this.state.tmpName === 'undefined' ||
      this.state.tmpName === ''
    ) {
      this.setState({ error: true });
      console.log(
        'Values: ' +
          this.state.tmpYearLevel +
          ', ' +
          this.state.tmpCourses +
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
          this.state.tmpUser_id +
          ', ' +
          this.state.tmpEmail +
          ', ' +
          this.state.tmpName
      );
      console.log(
        'typeof: ' +
          typeof this.state.tmpYearLevel +
          ', ' +
          typeof this.state.tmpCourses +
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
          typeof this.state.tmpUser_id +
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

  initUserInfo() {
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
          this.setState({ data: responseJson });
          if (typeof this.state.data !== 'undefined') {
            this.props.yearLevelChange(this.state.data[0].year_level);
            this.props.coursesChange(this.state.data[0].courses);
            this.props.sexChange(this.state.data[0].sex);
            this.props.numberOfRatingsChange(
              this.state.data[0].number_of_ratings
            );
            this.props.kindnessRatingChange(this.state.data[0].kindness);
            this.props.patienceRatingChange(this.state.data[0].patience);
            this.props.hardWorkingRatingChange(this.state.data[0].hard_working);
            this.props.authenticationTokenChange(
              this.state.data[0].authentication_token
            );
            this.props.passwordChange(this.state.data[0].password);
            //this.props.usernameChange(this.state.data[0].user_id);
            this.props.emailChange(this.state.data[0].email);
            this.props.nameChange(this.state.data[0].name);
          } else {
            // Do nothing
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  initUserSchedule() {
    let fetchURL = baseURL + 'schedule/:' + this.props.user_id;
    fetch(fetchURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (typeof responseJson !== 'undefined') {
          var tmp = [];
          tmp = responseJson;
          if (typeof tmp !== 'undefined') {
            this.props.scheduleArrayClear();
            tmp.forEach(item => {
              var startTimeToAdd = new Date(item.date);
              startTimeToAdd.setHours(item.time.substring(0, 2));
              startTimeToAdd.setMinutes(item.time.substring(3, 5));

              var endTimeToAdd = new Date(item.date);
              endTimeToAdd.setHours(item.time.substring(7, 9));
              endTimeToAdd.setMinutes(item.time.substring(10, 12));

              var tmpSchedule = {
                id: item.event_id,
                startDate: startTimeToAdd,
                endDate: endTimeToAdd,
                color: 'rgba(66,134,244,1)',
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
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  async initSequence() {
    await this.initUserSchedule();
    await this.initUserInfo();
  }

  onAccessoryPress() {
    this.setState({ login_secureTextEntry: !this.state.login_secureTextEntry });
  }

  login_renderPasswordAccessory() {
    let name = this.state.login_secureTextEntry
      ? 'visibility'
      : 'visibility-off';

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

  renderSignUpForm() {
    this.setState({ signUp: true });
  }

  unrenderSignUpForm() {
    this.setState({ signUp: false });
  }

  render() {
    if (this.state.signUp === false) {
      return (
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navBarTitle}>SE7EN</Text>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.input_container}>
              <TextField
                label="User ID: "
                title="TEMPORARY: Please enter User ID as an integer!"
                clearTextOnFocus={true}
                onChangeText={data => this.props.usernameChange(data)}
              />

              <TextField
                label="Password: "
                clearTextOnFocus={true}
                secureTextEntry={this.state.login_secureTextEntry}
                renderRightAccessory={this.login_renderPasswordAccessory()}
                onChangeText={data => this.props.passwordChange(data)}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
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
            <View style={styles.input_container}>
              <TextField
                label="Year level: "
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpYearLevel: data })}
              />
              <TextField
                label="Courses: "
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpCourses: data })}
              />

              <TextField
                label="Sex: "
                clearTextOnFocus={true}
                characterRestriction={1}
                title="Please input as an integer (0 - Male, 1 - Female, 2 - Both)"
                onChangeText={data => this.setState({ tmpSex: data })}
              />

              <TextField
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
              />

              <TextField
                label="User ID: "
                characterRestriction={10}
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpUser_id: data })}
              />

              <TextField
                label="Password: "
                clearTextOnFocus={true}
                secureTextEntry={this.state.login_secureTextEntry}
                renderRightAccessory={this.login_renderPasswordAccessory()}
                onChangeText={data => this.setState({ tmpPassword: data })}
              />

              <TextField
                label="Email: "
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpEmail: data })}
              />

              <TextField
                label="Name: "
                clearTextOnFocus={true}
                onChangeText={data => this.setState({ tmpName: data })}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
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
        </SafeAreaView>
      );
    }
  }
}

const statusBarHeight = Platform.OS === 'ios' ? 35 : 0;
const fontFamily = Platform.OS === 'ios' ? 'Avenir' : 'sans-serif';

const styles = StyleSheet.create({
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
});
