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

const fontFamily = Platform.OS === 'ios' ? 'Avenir' : 'sans-serif';

const user = () => (
  <View style={styles.heroContainer}>
    <Image
      source={{
        uri:
          'https://vignette.wikia.nocookie.net/internet-meme/images/0/0b/Monkathink.jpg/revision/latest?cb=20180310164639',
      }}
      style={styles.heroImage}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.heroTitle}>Pepehands</Text>
      <Text style={styles.heroSubtitle}>pepe@hands.com</Text>
    </View>
    <Chevron />
  </View>
);

export default class Profile extends React.Component {
  state = {
    year_level: '3',
    courses: ['CPEN 321', 'CPEN 331', 'CPEN 311', 'ELEC 221'],
    sex: 'Male',
    number_of_ratings: 1.0,
    kindness_rating: 2.0,
    patience_rating: 3.0,
    hard_working_rating: 4.0,
    authentication_token: 'abcdef123456',
    password: 'concac1234',
    user_id: '123456',
    email: 'pepe@hands.com',
    name: 'Pepe',
    text: '',
    userEdit: false,
    secureTextEntry: true,
    refreshing: false,
  };

  settingsData: SettingsData = [
    { type: 'CUSTOM_VIEW', key: 'user', render: user },
    {
      type: 'SECTION',
      header: 'My info'.toUpperCase(),
      footer:
        'Donec sed odio dui. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
      rows: [
        {
          title: 'Name: ' + this.state.name,
          subtitle: 'User ID: ' + this.state.user_id,
        },
        { title: 'Email: ' + this.state.email },
        { title: 'Sex: ' + this.state.sex },
        { title: 'Year level: ' + this.state.year_level },
        { title: 'Courses: ' + this.state.courses },
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
  
//  getUserInfo() {
//    fetch('URL HERE', {
//    	method: 'GET',})
//	.then((response) => response.json)
//	.then((responseJson) => {
//	  console.log(responseJson);
//	  this.setState({
//	    year_level: responseJson.year_level,
//	    courses: responseJson.courses,
//	    sex: responseJson.sex,
//	    number_of_ratings: responseJson.number_of_ratings,
//	    kindness_rating: responseJson.kindness_rating,
//	    patience_rating: responseJson.patience_rating,
//	    hard_working_rating: responseJson.hard_working_rating,
//	    authentication_token: responseJson.authentication_token,
//	    password: responseJson.password,
//	    user_id: responseJson.user_id,
//	    email: responseJson.email,
//	    name: responseJson.name,
//	  })
//	})
//	.catch((error) ={
//		console.error(error);
//	});
//  }

//  updateUserInfo(in_year_level, in_courses, in_sex, in_password, in_user_id, in_email, in_name) {
//    fetch('URL HERE', {
//    	method: 'PUT',})
//    	body: JSON.stringify({
//    	  year_level: in_year_level,
//	  courses: in_courses,
//	  sex: in_sex,
//	  password: in_password,
//	  user_id: in_user_id,
//	  email: in_email,
//	  name: in_name,
//    	})
//	.then((response) => response.json)
//	.then((responseJson) => {
//	  console.log(responseJson);
//	  if(responseJson.confirmation === 'true') {
//	    this.setState({
//	      year_level: responseJson.year_level,
//	      courses: responseJson.courses,
//	      sex: responseJson.sex,
//	      number_of_ratings: responseJson.number_of_ratings,
//	      kindness_rating: responseJson.kindness_rating,
//	      patience_rating: responseJson.patience_rating,
//	      hard_working_rating: responseJson.hard_working_rating,
//	      authentication_token: responseJson.authentication_token,
//	      password: responseJson.password,
//	      user_id: responseJson.user_id,
//	      email: responseJson.email,
//	      name: responseJson.name,
//	    })
//	    Alert.alert("Updated successfully!")
//		this.setState({userEdit: false})
//	  }
//	  else {
//	    Alert.alert("Update failed. Please retry!")
//	  }
//	})
//	.catch((error) ={
//		console.error(error);
//	});
//  }

  renderUserform() {
    this.setState({ userEdit: true });
    console.log('userform requested!');
  }

  unrenderUserform() {
    this.setState({ userEdit: false });
    console.log('go back!');
  }
  
  onAccessoryPress() {
      this.setState({ secureTextEntry: !secureTextEntry });
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
    // this.getUserInfo().then(() => this.setState({refreshing: false}));
    Alert.alert("Refreshing");
    this.wait(2000).then(() => this.setState({refreshing: false}));
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
                value={this.state.name}
                characterRestriction={20}
                clearTextOnFocus={true}
              />
            </View>
            <View style={styles.input_container}>
              <TextField
                label="User ID: "
                value={this.state.user_id}
                characterRestriction={20}
                clearTextOnFocus={true}
              />
            </View>
            <View style={styles.input_container}>
              <TextField
                label="Password: "
                value={this.state.password}
                characterRestriction={20}
                clearTextOnFocus={true}
                secureTextEntry={this.state.secureTextEntry}
                renderRightAccessory={this.renderPasswordAccessory()}
              />
            </View>
            <View style={styles.input_container}>
              <TextField
                label="Sex: "
                value={this.state.sex}
                clearTextOnFocus={true}
              />
            </View>
            
            <View style={styles.input_container}>
              <TextField
                label="Email: "
                value={this.state.email}
                keyboardType="email-address"
                clearTextOnFocus={true}
              />
            </View>
            <View style={styles.input_container}>
              <TextField label="Courses: " value={this.state.courses} />
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
                onPress={() => this.updateUserInfo()}
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

