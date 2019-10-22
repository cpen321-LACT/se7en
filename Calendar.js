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
  SafeAreaView,
  ScrollView,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextField } from 'react-native-material-textfield';
import { TextButton } from 'react-native-material-buttons';

addLocale('en', {
  months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
  monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sept_Oct_Nov_Dec'.split('_'),
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thur_Fri_Sat'.split('_'),
});

const fontFamily = Platform.OS === 'ios' ? 'Avenir' : 'sans-serif'

export default class Calendar extends React.Component {
  state = {
    userEdit: false,
    scheduleArray: [
    	{id: 0, startDate: new Date('October 21, 2019 03:24:00'), endDate: new Date('October 21, 2019 06:24:00'), color: 'blue', subject: 'CPEN 321', location: 'MCLD 215'} 
    ],
    tmpId: 0,
    tmpStartDate: new Date(),
    tmpEndDate: new Date(),
    tmpSubject: '',
    tmpLocation: '',
    
  }
  
  selectedDate = new Date();

  generateDates = (hours, minutes) => {
   		const date = new Date();
    	date.setHours(date.getHours() + hours);
    	if (minutes != null) {
      		date.setMinutes(minutes);
    	}
    	return date;
  };
  
  renderUserform() {
    this.setState({ userEdit: true });
    console.log('userform requested!');
  }

  unrenderUserform() {
    this.setState({ userEdit: false });
    console.log('go back!');
  }
  
//  addSchedule() {
//    fetch('URL HERE', {method: 'GET',})
//	   .then((response) => response.json)
//	   .then((responseJson) => {
//	  		console.log(responseJson);
//	  		fetch('URL HERE', {method: 'PUT',})
//	  			body: JSON.stringify({
//	  				user_id: responseJson.user_id,
//	  				startDate: this.state.tmpStartDate,
//	  				endDate: this.state.tmpEndDate,
//	  				subject: this.state.tmpSubject,
//	  				location: this.state.tmpLocation,
//	  			})
//	  		.then((response) => response.json)
//	  		.then((responseJson) => {
//	  			console.log(responseJson);
//	  			if(responseJson.confirmation === 'true') {
//	  				var tmp = {id: this.state.tmpId, startDate: this.state.tmpStartDate, endDate: this.state.tmpEndDate, color: 'blue', subject: this.state.tmpSubject, location: this.state.tmpLocation}
//	  				this.setState(scheduleArray=>{state.scheduleArray.concat(tmp)})
//	  				this.setState({tmpId: tmpId + 1})
//					Alert.alert("Added new scheduly successfully")
//					this.setState({userEdit: false})
//	  			}
//	  			else {
//	  				Alert.alert("Adding new schedule failed")
//	  			}
//	  		})	
//	  	})
//		.catch((error) ={
//			console.error(error);
//		});
//  }
  	
  render() {
    var tmpEvents = [];
    var tmpEvent = [];
    if(!this.state.userEdit){
      return (
        <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
        	{<View style={styles.container_calendar}>
    			<StatusBar barStyle="light-content" backgroundColor="#4286f4" />
          		<View style={styles.navBar}>
          			<Text style={styles.navBarTitle}>Calendar</Text>
        		</View>
    			<WeekView
 					events={this.state.scheduleArray}
          			selectedDate={this.selectedDate}
          			numberOfDays={7}
          			onEventPress={(event) => Alert.alert('Event: ' + event.id,
          											 	('Time: ' + event.startDate.getUTCHours() + ':' + event.startDate.getUTCMinutes() + ' - ' + event.endDate.getUTCHours() + ':' + event.endDate.getUTCMinutes() + '\nDate: ' + (event.startDate.getUTCMonth() + 1) + '/' + event.startDate.getUTCDate() + '/' + event.startDate.getUTCFullYear() + '\nSubject: ' + event.subject + '\nLocation: ' + event.location))}
          			headerStyle={styles.header_calendar}
          			formatDateHeader="ddd D"
          			locale="en"
        		/> 	
        	</View>}
		    <ActionButton 
		      buttonColor="rgba(66,134,244,1)"
		      onPress={() => this.renderUserform()}
        	/>
        </View>
      );
    }
    
    else {
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
                label="Start date: "
                value={''}
                clearTextOnFocus={true}
                onChangeText = {(data)=> this.state.tmpStartDate = data}
              />
              
              <TextField
                label="End date: "
                value={this.state.tmpEndDate}
                clearTextOnFocus={true}
                onChangeText = {(data)=> this.state.tmpEndDate = data}
              />
              
              <TextField
                label="Subject: "
                value={''}
                clearTextOnFocus={true}
                onChangeText = {(data)=> this.state.tmpSubject = data}
              />
              
              <TextField
                label="Location: "
                value={''}
                clearTextOnFocus={true}
                onChangeText = {(data)=> this.state.tmpLocation = data}
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
                title="add"
                onPress={() => this.addSchedule()}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
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
