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
export const baseURL = Platform.OS === 'android' ?
    'http://10.0.2.2:3000/':'http://localhost:3000/';


export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userEdit: false,

      scheduleArray: [{id: 0, startDate: new Date('October 21, 2019 03:24:00'), endDate: new Date('October 21, 2019 06:24:00'), color: 'blue', description: 'CPEN 321', location: 'MCLD 215'}
    ],

      tmpId: 0,
      tmpColor: 'blue',
      tmpDate: '0',

      tmpStartTimeString: '',
      tmpStartTime: new Date(),
      tmpEndTimeString: '',
      tmpEndTime: new Date(),

      tmpSubject: '',
      tmpLocation: '',
      data: [],

      celendar_refreshing: false,
    };
  }


  renderUserform() {
    this.setState({ userEdit: true });
    console.log('userform requested!');
  }

  unrenderUserform() {
    this.setState({ userEdit: false });
    console.log('go back!');
  }

  addSchedule() {
	  //post a new event to the backend
			let fetchURL = baseURL + 'user/';

      var eventStart = new Date();
      console.log(eventStart.getUTCDate());
      console.log(parseInt(this.state.tmpDate));
      eventStart.setUTCDate(eventStart.getUTCDate()+parseInt(this.state.tmpDate)-1);
      console.log(eventStart.getUTCDate());
      var tempTime = this.state.tmpStartTimeString.split(' ');
      eventStart.setHours(parseInt(tempTime[0]),parseInt(tempTime[1]));

      var eventEnd = new Date();
      eventEnd.setUTCDate(eventEnd.getUTCDate()+parseInt(this.state.tmpDate)-1);
      var tempTime2 = this.state.tmpEndTimeString.split(' ');
      eventEnd.setHours(parseInt(tempTime2[0]),parseInt(tempTime2[1]));

      this.setState({tmpStartTime: eventStart});
      this.setState({tmpEndTime: eventEnd});

      var tmp = {id: this.state.tmpId, startDate: this.state.tmpStartTime, endDate: this.state.tmpEndTime, color: this.state.tmpColor, description: this.state.tmpSubject, location: this.state.tmpLocation};
      this.setState({ scheduleArray: this.state.scheduleArray.concat(tmp)});
      this.setState({tmpId : this.state.tmpId + 1});
      this.setState({userEdit: false});


		//	console.log(fetchURL);
	 		fetch(fetchURL, {
				method: 'POST',
				headers: {
    			Accept: 'application/json',
    			'Content-Type': 'application/json',
  			},
			  body: JSON.stringify({
				  event_id: this.state.tmpId,
	  			user_id: this.props.user_id,
	  			time: this.state.tmpStartTimeString + '-' + this.state.tmpEndTimeString,
				  date: ( this.state.tmpStartTime.getUTCMonth()+1) +'/'+this.state.tmpStartTime.getUTCDate()+'/'+ this.state.tmpStartTime.getUTCFullYear(),
				  subject: this.state.tmpSubject,
				  location: this.state.tmpLocation,
			  }),
		  })
	    .then((response) => response.text())
	    .then((responseJson) => {
	  		  console.log(responseJson);
	    });
   }

  refreshMatches(){
 	   //ask for matches
 	 		//let url = baseURL + 'user/:' + this.props.user_id + '/matches/potential_matches';
      // console.log(url);
 	  	// fetch(url, {
 			// 	method: 'GET'})
      //  .then((response) => response.text())
 	    //  .then((responseJson) => {
      //     this.setState({data: responseJson})
 			//     console.log(this.state.data[0].potential_matches);
 			//  })
   }

   _onRefresh = () => {
     console.log('refreshing');
     console.log(this.state.calendar_refreshing);
     this.setState({calendar_refreshing:true});
     this.refreshMatches();
     this.setState({calendar_refreshing:false});
     console.log(this.state.calendar_refreshing);
   }

  render() {
    if(!this.state.userEdit){
      return (
        <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
        	{
            <SafeAreaView style={styles.container}>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.calendar_refreshing}
                    onRefresh={this._onRefresh}
                  />
                }>
                <View style={styles.container_calendar}>
    			         <StatusBar barStyle="light-content" backgroundColor="#4286f4" />
          		     <View style={styles.navBar}>
          			      <Text style={styles.navBarTitle}>Calendar</Text>
        		       </View>

            			<WeekView
         					      events={this.state.scheduleArray}
                  			selectedDate={new Date()}

                  			numberOfDays={7}
                  			onEventPress={(event) => Alert.alert('Event: ' + event.id,
                  											 	('Time: ' + event.startDate.getUTCHours() + ':' + event.startDate.getUTCMinutes() + ' - ' + event.endDate.getUTCHours() + ':' + event.endDate.getUTCMinutes() + '\nDate: ' + (event.startDate.getUTCMonth() + 1) + '/' + event.startDate.getUTCDate() + '/' + event.startDate.getUTCFullYear() + '\nSubject: ' + event.subject + '\nLocation: ' + event.location))}
                  			headerStyle={styles.header_calendar}
                  			formatDateHeader="ddd D"
                  			locale="en"
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
              label="Date: "
              value={'1 to 7'}
              clearTextOnFocus={true}
              onChangeText = {(data)=> this.setState({tmpDate: data}) }
            />
              <TextField
                label="Start time: "
                value={'20 30'}
                clearTextOnFocus={true}
                onChangeText = {(data)=> this.setState({tmpStartTimeString: data}) }
              />

              <TextField
                label="End time: "
                value={'21 30'}
                clearTextOnFocus={true}
                onChangeText = {(data)=> this.setState({ tmpEndTimeString: data}) }
              />
              <TextField
                label="Subject: "
                value={''}
                clearTextOnFocus={true}
                onChangeText = {(data)=> this.setState({ tmpSubject: data})}
              />

              <TextField
                label="Location: "
                value={''}
                clearTextOnFocus={true}
                onChangeText = {(data)=> this.setState({ tmpLocation: data})}
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

              <TextButton
                style={{ margin: 4 }}
                titleColor="#4286f4"
                color="rgba(0, 0, 0, .05)"
                title="log"
                onPress={() => console.log(this.state.tmpStartTime.getUTCMonth() + 1 + '/' + this.state.tmpStartTime.getUTCDate() + '/' + this.state.tmpStartTime.getUTCFullYear())}
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
