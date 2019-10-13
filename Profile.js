'use strict'

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  View,
  StatusBar,
  Image,
  Platform,
  RefreshControl,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { SettingsScreen, SettingsData, Chevron } from 'react-native-settings-screen'

const fontFamily = Platform.OS === 'ios' ? 'Avenir' : 'sans-serif'

const user = () => (
  <View style={styles.heroContainer}>
  	<Image source={{uri: 'https://vignette.wikia.nocookie.net/internet-meme/images/0/0b/Monkathink.jpg/revision/latest?cb=20180310164639'}} style={styles.heroImage} />
    <View style={{ flex: 1 }}>
      <Text style={styles.heroTitle}>Pepehands</Text>
      <Text style={styles.heroSubtitle}>pepe@hands.com</Text>
    </View>
    <Chevron/>
  </View>
)

export default class Profile extends React.Component {
	state = {
		refreshing: false,
	}

  	settingsData: SettingsData = [
    	{ type: 'CUSTOM_VIEW', key: 'user', render: user },
    	{
      		type: 'SECTION',
      		header: 'My Section'.toUpperCase(),
      		footer:'Donec sed odio dui. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
    		rows: [
        		{
          			title: 'A row',
          			showDisclosureIndicator: true,
        		},
        		{ title: 'A non-tappable row' },
       			{
          			title: 'This row has a',
          			subtitle: 'Subtitle',
          			showDisclosureIndicator: true,
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
		      }}
		    >
		      v1.0.0
		    </Text>
		  ),
		},
	  ]

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4286f4" />
        <View style={styles.navBar}>
          <Text style={styles.navBarTitle}>Settings</Text>
        </View>
        <SettingsScreen
          data={this.settingsData}
          globalTextStyle={{ fontFamily }}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.setState({ refreshing: true })
                  setTimeout(() => this.setState({ refreshing: false }), 3000)
                }}
              />
            ),
          }}
        />
      </View>
    )
  }
}

const statusBarHeight = Platform.OS === 'ios' ? 35 : 0

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
})
