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
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  SettingsScreen,
  SettingsData,
  Chevron,
} from 'react-native-settings-screen';
import PropType from 'prop-types';
import { TextField } from 'react-native-material-textfield';
import { TextButton } from 'react-native-material-buttons';

export const baseURL = Platform.OS === 'android' ?
    'http://10.0.2.2:3000/':'http://localhost:3000/';

const fontFamily = Platform.OS === 'ios' ? 'Avenir' : 'sans-serif';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEdit: false,
      secureTextEntry: true,
      refreshing: false,
      tmpName: '',
      tmpUser_id: '0',
      tmpPassword: '',
      tmpSex: '0',
      tmpEmail: '',
      tmpCourses: '',
      tmpYearLevel: '',
      data: [],
    };
  }

  settingsData: SettingsData = [
    {
      type: 'CUSTOM_VIEW',
      render: () => (
        <View style={styles.heroContainer}>
          <Image source={{uri:'https://vignette.wikia.nocookie.net/internet-meme/images/0/0b/Monkathink.jpg/revision/latest?cb=20180310164639',}} style={styles.heroImage}/>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>{this.props.name}</Text>
            <Text style={styles.heroSubtitle}>User ID: {this.props.user_id}</Text>
          </View>
        </View>
      )
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
            </Text>
          ),
          renderAccessory: () => (
            <Text style={{ color: '#999', marginRight: 6, fontSize: 18 }}>
              {this.props.courses}
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

 getUserInfo() {
   let fetchURL = baseURL + 'user/' + this.props.user_id + '/info';
   fetch(fetchURL, {
   	 method: 'GET',
     headers: {
       Accept: 'application/json',
       'Content-Type': 'application/json',
     },
	 })
   .then((response) => response.json())
   .then((responseJson) => {
     //console.log(responseJson)
     if(typeof(responseJson) !== 'undefined') {
       this.setState({data:responseJson})
       if(typeof(this.state.data) !== 'undefined') {
         this.props.yearLevelChange(this.state.data[0].year_level);
         this.props.coursesChange(this.state.data[0].courses);
         this.props.sexChange(this.state.data[0].sex);
         this.props.passwordChange(this.state.data[0].password);
         this.props.usernameChange(this.state.data[0].user_id);
         this.props.emailChange(this.state.data[0].email);
         this.props.nameChange(this.state.data[0].name);
       }
       else {
         // Do nothing
       }
     }
   })
   .catch((error) => {
		 console.error(error);
	 });
 }

 pushUserInfo() {
   let fetchURL = baseURL + 'user/info';
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
       number_of_ratings : this.props.number_of_ratings,
       kindness_rating : this.props.kindness_rating,
       patience_rating : this.props.patience_rating,
       hard_working_rating : this.props.hard_working_rating,
       authentication_token : this.props.authentication_token,
	     password: this.state.tmpPassword,
	     user_id: this.state.tmpUser_id,
	     email: this.state.tmpEmail,
	     name: this.state.tmpName,
   	 }),
   })
  .then((response) => response.text())
  .then((responseJson) => {
	  console.log(responseJson);
    this.props.yearLevelChange(this.state.tmpYearLevel);
    this.props.coursesChange(this.state.tmpCourses);
    this.props.sexChange(this.state.tmpSex);
    this.props.passwordChange(this.state.tmpPassword);
    this.props.usernameChange(this.state.tmpUser_id);
    this.props.emailChange(this.state.tmpEmail);
    this.props.nameChange(this.state.tmpName);
    Alert.alert("Updated successfully!")
		this.setState({userEdit: false})
    // console.log(this.props.year_level);
    // console.log(this.props.courses);
    // console.log(this.props.sex);
    // console.log(this.props.password);
    // console.log(this.props.user_id);
    // console.log(this.props.email);
    // console.log(this.props.name);
	})
	.catch((error) => {
		console.error(error);
	});
 }

  renderUserform() {
    this.setState({ userEdit: true });
    console.log('userform requested!');
  }

  unrenderUserform() {
    this.setState({ userEdit: false });
    console.log('go back!');
  }

  onAccessoryPress() {
      this.setState({ secureTextEntry: !this.state.secureTextEntry });
  }

  renderPasswordAccessory() {
      let name = this.state.secureTextEntry?
        'visibility':
        'visibility-off';

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

  wait(timeout) {
    return new Promise(resolve => {
       setTimeout(resolve, timeout);
    });
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getUserInfo();
    this.setState({refreshing: false});
    //Alert.alert("Refreshing");
    //this.wait(2000).then(() => this.setState({refreshing: false}));
  }

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
                <StatusBar barStyle="light-content" backgroundColor="#4286f4" />
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

          <ActionButton
            buttonColor="rgba(66,134,244,1)"
            onPress={() => this.renderUserform()}
          />
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
                characterRestriction={20}
                //clearTextOnFocus={true}
                onChangeText = {(data)=> this.setState({tmpName:data})}
              />

              <TextField
                label="User ID: "
                value={this.props.user_id}
                characterRestriction={20}
                //clearTextOnFocus={true}
                onChangeText = {(data)=> this.setState({tmpUser_id:data})}
              />

              <TextField
                label="Password: "
                value={this.props.password}
                characterRestriction={20}
                //clearTextOnFocus={true}
                secureTextEntry={this.state.secureTextEntry}
                renderRightAccessory={this.renderPasswordAccessory()}
                onChangeText = {(data)=> this.setState({tmpPassword:data})}
              />

              <TextField
                label="Year level: "
                value={this.props.year_level}
                characterRestriction={20}
                //clearTextOnFocus={true}
                onChangeText = {(data)=> this.setState({tmpYearLevel:data})}
              />

              <TextField
                label="Sex:"
                value={this.props.sex}
                characterRestriction={1}
                title="Please input as an integer (0 - Male, 1 - Female, 2 - Both)"
                //clearTextOnFocus={true}
                onChangeText = {(data)=> this.setState({tmpSex:data})}
              />

              <TextField
                label="Email: "
                value={this.props.email}
                keyboardType="email-address"
                //clearTextOnFocus={true}
                onChangeText = {(data)=> this.setState({tmpEmail:data})}
              />

              <TextField
                label="Courses: "
                value={this.props.courses}
                onChangeText = {(data)=> this.setState({tmpCourses:data})}
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
              <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="log"
                onPress={() => console.log(this.state.tmpSex)}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}

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
