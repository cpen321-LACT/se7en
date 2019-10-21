'use strict'

import React, { Component } from 'react';
import WeekView, { addLocale } from 'react-native-week-view';
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
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

addLocale('en', {
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sept_Oct_Nov_Dec'.split('_'),
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thur_Fri_Sat'.split('_'),
});

const fontFamily = Platform.OS === 'ios' ? 'Avenir' : 'sans-serif'

export default class Calendar extends React.Component {
  selectedDate = new Date();

  generateDates = (hours, minutes) => {
   		const date = new Date();
    	date.setHours(date.getHours() + hours);
    	if (minutes != null) {
      		date.setMinutes(minutes);
    	}
    	return date;
  };
  	
  render() {
    const events = [
      {
        id: 1,
        description: 'Event 1',
        startDate: this.generateDates(0),
        endDate: this.generateDates(2),
        color: 'blue',
        subject: 'CPEN 321',
        location: 'MCLD 215'
      },
      {
        id: 2,
        description: 'Event 2',
        startDate: this.generateDates(1),
        endDate: this.generateDates(4),
        color: 'red',
      },
      {
        id: 3,
        description: 'Event 3',
        startDate: this.generateDates(-5),
        endDate: this.generateDates(-3),
        color: 'green',
      },
    ];
  
    return (
        <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
        	{<View style={styles.container_calendar}>
    			<StatusBar barStyle="light-content" backgroundColor="#4286f4" />
          		<View style={styles.navBar}>
          			<Text style={styles.navBarTitle}>Calendar</Text>
        		</View>
    			<WeekView
 					events={events}
          			selectedDate={this.selectedDate}
          			numberOfDays={7}
          			onEventPress={(event) => Alert.alert('Event: ' + event.id,
          											 	('Time: ' + event.startDate.getUTCHours() + ':' + event.startDate.getUTCMinutes() + ' - ' + event.endDate.getUTCHours() + ':' + event.endDate.getUTCMinutes() + '\nDate: ' + (event.startDate.getUTCMonth() + 1) + '/' + event.startDate.getUTCDate() + '/' + event.startDate.getUTCFullYear() + '\nSubject: ' + event.subject + '\nLocation: ' + event.location))}
          			headerStyle={styles.header_calendar}
          			formatDateHeader="ddd D"
          			locale="en"
        		/>
        	</View>}
		    <ActionButton buttonColor="rgba(66,134,244,1)">
        	</ActionButton>
      </View>
    );
  }
}

const statusBarHeight = Platform.OS === 'ios' ? 35 : 0

const styles = StyleSheet.create({
  container_calendar: {
  	flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header_calendar: {
    backgroundColor: '#4286f4',
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
