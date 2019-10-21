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
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SettingsScreen,
  SettingsData,
  Chevron,
} from 'react-native-settings-screen';
import PropType from 'prop-types';

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
  	password: '',
  	user_id: '123456',
  	email: 'pepe@hands.com',
  	name: 'Pepe',
  }

//  	componentDidMount() {
//  		fetch('URL HERE', {
//  			method: 'GET',
//  		})
//  		.then((response) => response.json)
//  		.then((responseJson) => {
//  			console.log(responseJson);
//  			this.setState({
//  				year_level: responseJson.year_level,
//  				courses: responseJson.courses,
//  				sex: responseJson.sex,
//  				number_of_ratings: responseJson.number_of_ratings,
//  				kindness_rating: responseJson.kindness_rating,
//  				patience_rating: responseJson.patience_rating,
//  				hard_working_rating: responseJson.hard_working_rating,
//  				authentication_token: responseJson.authentication_token,
//  				password: responseJson.password,
//  				user_id: responseJson.user_id,
//  				email: responseJson.email,
//  				name: responseJson.name,
//  			})
//  		})
//  		.catch((error) ={
//  			console.error(error);
//  		});
//  	}

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
        { title: 'Email: ' + this.state.email},
        { title: 'Sex: ' + this.state.sex},
        { title: 'Year level: ' + this.state.year_level},
        { title: 'Courses: ' + this.state.courses},
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

  render() {
    return (
    <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
      {<View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4286f4" />
        <View style={styles.navBar}>
          <Text style={styles.navBarTitle}>Settings</Text>
        </View>
        <SettingsScreen
          data={this.settingsData}
          globalTextStyle={{ fontFamily }}
        />
      </View>}
      
      <ActionButton buttonColor="rgba(66,134,244,1)"
  		onPress={() => {}}
	  />
      </View>
    );
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
    marginTop: 40,
    marginBottom: 50,
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
});

