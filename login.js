import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';




class Home extends PureComponent {
	state ={username: 'user_id',
		password: 'password',
		show: true
	}
	signin(){
		fetch('URL HERE', {method: 'POST',
			body: JSON.stringify({
	  			user_id: this.state.username,
	  			password: this.state.password
			})
		})
	   .then((response) => response.json)
	   .then((responseJson) => {
	  		console.log(responseJson);
		   	if(responseJson.confirmation == true)
			   this.setState({show:false});
		}
	}
	signup(){
			fetch('URL HERE', {method: 'POST',
			body: JSON.stringify({
	  			user_id: this.state.username,
	  			password: this.state.password
			})
		})
	   .then((response) => response.json)
	   .then((responseJson) => {
	  		console.log(responseJson);
		   	if(responseJson.confirmation == true)
			   this.setState({show:false});
		   	else alert('Username exists');
		}
	}

	facebooklogin(){
	}
  render() {
    return (
 <View> 
        <Input
          label='Username"
	  icon = {<Icon name="user"/>}
	  value = {this.state.username}
	  onChangeText = {(data) => this.state.username = data}          
        />
        <Input
          label='Password'
          icon ={<Icon name="key"/>}
	  value = {this.state.password}
	  onChangeText ={(data) => this.state.username = data}
        />
        <Button
          title='signin' onClick = signIn()    />
	 <Button title="Login with facebook" onClick = facebooklogin()/>
	    <Button title ="Sign up" onClick = signUp()/>

	    </View>

    );
  }
}

export default Home;
