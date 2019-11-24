import React from "react";
import { Platform, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import Fire from "./firebase.js";

export default class Chat extends React.Component {
    state = {
        messages: []
    };
    componentWillMount(){

    }

  componentDidMount() {
    Fire.loadMessages((message)=>{
      this.setState((previousState)=>{
        return{
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    });
  }
  componentWillUnmount() {
    Fire.closeChat();
  }


    render() {
        return(

        <GiftedChat
         messages={this.state.messages}
         onSend={(message)=>{
           Fire.sendMessage(message);
         }}
         user={{
           _id:Fire.getUid(),
           name: this.props.name,
         }}
         />
       );
     }
   }


Chat.defaultProps={
  name:'hi',
  userID:'7783204195',
};
//Chat.propTypes={
//  name: React.PropTypes.string,
//  userID:React.PropTypes.string,
//};
