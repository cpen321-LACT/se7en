import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  View
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import {Dimensions} from 'react-native'
import Calendar from './Calendar.js'
import Profile from './Profile.js'
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';

const deviceW = Dimensions.get('window').width
const basePx = 375
function px2dp(px) {
  return px *  deviceW / basePx
}

export default class App extends Component {
  state= {
    selectedTab: 'calendar'
  };

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
  }
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  
  
  /* -------------------------------- Start of push notification -------------------------------- */
    // we check if user has granted permission to receive push notifications.
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  
    // If token was fetched earlier, it can be retrieved from AsyncStorage. 
    // If no token is found, request Firebase and save it in AsyncStorage.
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }
  
    // If permission hasn’t been granted to our app, request user in requestPermission method. 
    // If permission is successfully assigned, proceed towards token fetch, otherwise gracefully ignore the fact.
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

  /* ---------------------------- Tutorial added but idk where to put it here 
  render() {
    return (
      <View style={{flex: 1}}>
        <Text>Welcome to React Native!</Text>
      </View>
    );
  }
  */
  /* -------------------------------- End of push notification -------------------------------- */

  render() {
    return (
      <TabNavigator style={styles.container}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'calendar'}
          title="Calendar"
          selectedTitleStyle={{color: "#3496f0"}}
          renderIcon={() => <Icon name="calendar" size={px2dp(22)} color="#666"/>}
          renderSelectedIcon={() => <Icon name="calendar" size={px2dp(22)} color="#3496f0"/>}
          //badgeText="1"
          onPress={() => this.setState({selectedTab: 'calendar'})}>
          <Calendar/>
        </TabNavigator.Item>
        
        <TabNavigator.Item
          selected={this.state.selectedTab === 'profile'}
          title="Profile"
          selectedTitleStyle={{color: "#3496f0"}}
          renderIcon={() => <Icon name="user" size={px2dp(22)} color="#666"/>}
          renderSelectedIcon={() => <Icon name="user" size={px2dp(22)} color="#3496f0"/>}
          onPress={() => this.setState({selectedTab: 'profile'})}>
          <Profile/>
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});


