import firebase from "firebase";


class Fire {
  uid = '';
  messagesRef = null;

    constructor() {
	
    if (!firebase.apps.length) {
            firebase.initializeApp({
                export const firebaseConfig = {
  apiKey: "AIzaSyAG6zporpVrS6FdMBZ_2I_Q9ifkH4ur2pw",
  authDomain: "se7en-63e1b.firebaseapp.com",
  databaseURL: "https://se7en-63e1b.firebaseio.com",
  projectId: "se7en-63e1b",
  storageBucket: "se7en-63e1b.appspot.com",
  messagingSenderId: "849644814206",
}

            });
}
            firebase.auth().onAuthStateChanged(user => {
              if(user){
                this.setUid(user.uid);

              }else{
                firebase.auth().signInAnonymously().cath((error)=>{
                  alert(error.message);
                });
              }
            });
        }
    setUid(value){
      this.uid = value;
    }

    getUid(){
      return this.uid;
    }
    loadMessages(callback){
      this.messagesRef = firebase.database().ref('messages');
      this.messagesRef.off();
      const onReceive = (data) =>{
        const message = data.val();
        callback({
          _id:data.key,
          text:message.text,
          createdAt: new Date(message.createdAt),
          user:{
            _id:message.user._id,
            name:message.user.name,
          },
        });
      };
      this.messagesRef.limitToLast(20).on('child_added', onReceive);
    }
    sendMessage(message){
      for(let i=0 ; i < message.length; i++){
        this.messagesRef.push({
          text: message[i].text,
          user: message[i].user,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }
    }
    closeChat(){
      if(this.messagesRef){
        this.messageRef.off();
      }
    }
  }
export default new Fire();
