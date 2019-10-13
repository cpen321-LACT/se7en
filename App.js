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

const deviceW = Dimensions.get('window').width
const basePx = 375
function px2dp(px) {
  return px *  deviceW / basePx
}

export default class App extends Component {
  state= {
    selectedTab: 'calendar'
  };

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
