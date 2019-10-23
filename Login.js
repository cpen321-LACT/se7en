'use strict'

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

export const baseURL = Platform.OS === 'android' ?
    'http://10.0.2.2:3000/':'http://localhost:3000/';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
		  data: [],
      login_secureTextEntry: true,
	  };
  }

	signIn() {
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
        if(typeof(responseJson) !== 'undefined') {
          this.setState({data:responseJson})
          if(typeof(this.state.data[0]) !== 'undefined' && (this.state.data[0].password === this.props.password)) {
              this.props.logVisibleChange();
          }
          else {
            Alert.alert("Incorrect user ID or password!");
          }
        }
        else {
          Alert.alert("Incorrect user ID or password!");
        }
		  })
      .catch((error) => {
        console.error(error);
      });
	}

	signUp() {
			let fetchURL = baseURL + 'user/';
	 		fetch(fetchURL, {
				method: 'POST',
				headers: {
    			Accept: 'application/json',
    			'Content-Type': 'application/json',
  			},
			  body: JSON.stringify({
	  			user_id: this.props.user_id,
	  			password: this.props.password,
			  }),
		  })
	   // .then((response) => response.text())
	   // .then((responseJson) => {
	  	// 	console.log(responseJson);
		 //   	if(responseJson.confirmation === true) {
			// 			this.changeLogVisible();
			// 	}
		 //   	else {
			// 		Alert.alert('Username exists');
			// 	}
		 // });
     Alert.alert("Signed up successfully!")
	 }

	//
	// facebooklogin(){
	// }

  onAccessoryPress() {
      this.setState({ login_secureTextEntry: !this.state.login_secureTextEntry });
  }

  login_renderPasswordAccessory() {
      let name = this.state.login_secureTextEntry?
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

	render() {
    return (
			<SafeAreaView style={styles.safeContainer}>
				<ScrollView
					style={styles.scroll}
					contentContainerStyle={styles.contentContainer}
					keyboardShouldPersistTaps="handled">
					<View style={styles.input_container}>
						<TextField
							label="User ID: "
              title="TEMPORARY: Please enter User ID as an integer!"
							value={''}
							clearTextOnFocus={true}
							onChangeText = {(data)=> this.props.usernameChange(data)}
						/>

						<TextField
							label="Password: "
							value={''}
							clearTextOnFocus={true}
              secureTextEntry={this.state.login_secureTextEntry}
              renderRightAccessory={this.login_renderPasswordAccessory()}
							onChangeText = {(data)=> this.props.passwordChange(data)}
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
							onPress={() => this.signUp()}
						/>
					</View>
				</ScrollView>
			</SafeAreaView>
 			// <View>
      // 	<Input
      //     label='Username'
	  	// 		icon = {<Icon name="user"/>}
	  	// 		// value = {this.props.username}
	  	// 		// onChangeText = {(data) => this.state.username = data}
      //   />
      //   <Input
      //     label='Password'
      //     icon ={<Icon name="key"/>}
	  	// 		// value = {this.state.password}
	  	// 		// onChangeText ={(data) => this.state.username = data}
      //   />
      //   <Button title='Sign In' /* onClick = signIn() *//>
	 		// 	<Button title="Login with facebook" /* onClick = facebooklogin()*/ />
	    // 	<Button title="Sign Up" /* onClick = signUp() *//>
	    // </View>
    );
   }
}

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
});
