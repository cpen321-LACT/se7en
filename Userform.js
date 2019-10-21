import React,{Component} from 'react';
import {Modal, Text, View,Button, TextInput, Style} from 'react-native';

export default class Userform extends Component{
	
	state ={
		modalVisible: false,
		stime:'0',
		etime:'0',
		date:'1',
		subject:'demo',
		locate: 'demo'
	};
	
	render(){
		return(
			<View style={{marginTop: 22}}>
       <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
              		<TextInput style = {{height: 40, borderColor: 'gray', borderWidth: 1}}
			placeholder="start time" 
			onChangeText = {(value) => this.setState({stime:value})}
			value = {this.state.stime}/>

              		<TextInput style = {{height: 40, borderColor: 'gray', borderWidth: 1}}
			placeholder="end time" 
			onChangeText = {(value) => this.setState({etime:value})}
			value = {this.state.etime}/>

              		<TextInput style = {{height: 40, borderColor: 'gray', borderWidth: 1}}
			placeholder="date" 
			onChangeText = {(value) => this.setState({date:value})}
			value = {this.state.date}/>

              		<TextInput style = {{height: 40, borderColor: 'gray', borderWidth: 1}}
			placeholder="subject" 
			onChangeText = {(value) => this.setState({subject:value})}
			value = {this.state.subject}/>

              		<TextInput style = {{height: 40, borderColor: 'gray', borderWidth: 1}}
			placeholder="location" 
			onChangeText = {(value) => this.setState({locate:value})}
			value = {this.state.locate}/>

              <Button title="exit"
                onPress={() => {
		  this.setState({stime:'0', etime:'0', date:'1', subject: 'demo',locate: 'demo'});
                  this.setModalVisible(!this.state.modalVisible);
                }}/>
              <Button title="add"
			onPress={() =>{axios.get('/').then((response) =>{axios.post('/',
				{user_id: response.user_id,
				time : this.state.stime + '-' +this.state.etime,
				date : this.state.date,
				subject : this.state.subject,
				location: this.state.locate});});}}>
        </Button>
            </View>
          </View>
        </Modal>

        <Button buttonColor="rgba(231,76,60,1)"
          onPress={() => {
            this.setModalVisible(true);
          }}>
        </Button>	
	</View>
		);
	}

}
