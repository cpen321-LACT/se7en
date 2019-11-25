"use strict";

import React from "react";
import {
    StyleSheet,
    Alert,
    Text,
    View,
    StatusBar,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Platform,
    FlatList,
} from "react-native";
import { ListItem } from "react-native-elements"

/* -------------------------------------------------------------------------- */
/* Styles */
const fontFamily = Platform.OS === "ios" ? "Avenir" : "sans-serif";
const statusBarHeight = Platform.OS === "ios" ? 35 : 0;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    navBar: {
        backgroundColor: "#4286f4",
        height: 44 + statusBarHeight,
        alignSelf: "stretch",
        paddingTop: statusBarHeight,
        justifyContent: "center",
        alignItems: "center",
    },
    navBarTitle: {
        color: "#FFF",
        fontFamily,
        fontSize: 17,
    },

    scroll: {
        backgroundColor: "transparent",
    },

    inputContainer: {
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
        backgroundColor: "white",
        fontFamily,
    },
});

/* -------------------------------------------------------------------------- */

/* For server uses */
export const baseURL =
    Platform.OS === "android"
        ? "http://104.211.35.37:8081/"
        : "http://104.211.35.37:8081/";

/* For emulator */
// export const baseURL =
//   Platform.OS === "android"
//     ? "http://10.0.2.2:3000/"
//     : "http://localhost:3000/";

/* For physical device */
// export const baseURL =
//   Platform.OS === "android"
//     ? "http://127.0.0.1:3000/"
//     : "http://localhost:3000/";


export default class Matches extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            /* User info states */
            matchesRefreshing: false,
        };
    }

    /* -------------------------------------------------------------------------- */
    /* ListItem related methods */
  /*  renderCurrentMatchesItem = ({ item }) => (
        <ListItem
            title={item.name}
            subtitle={item.subtitle}
            leftAvatar={{ source: { uri: item.avatar_url } }}
            bottomDivider
            chevron
            onPress={() => Alert.alert(item.name, "Do you want to cancel this match?",
                [
                    { text: "Yes", onPress: () => this.deleteCurrentMatch(item.subtitle) },
                    { text: "No", type: "cancel" }
                ])}
        />
    )*/
    

    renderIncomingMatchesItem = ({ item }) => (
        <ListItem
            title={item.name}
            subtitle={item.subtitle}
            leftAvatar={{ source: { uri: item.avatar_url } }}
            bottomDivider
            chevron
            onPress={() => Alert.alert(item.name, "Do you want to accept this match?",
                [
                    { text: "Yes", onPress: () => this.deleteIncomingMatch(item.name, item.subtitle) },
                    { text: "No", type: "cancel" }
                ])}
        />
    )

    renderPotentialMatchesItem = ({ item }) => (
        <ListItem
            title={item.name}
            subtitle={item.subtitle}
            leftAvatar={{ source: { uri: item.avatar_url } }}
            bottomDivider
            chevron
            onPress={() => Alert.alert(item.name, "Do you want to request for this match?",
                [
                    { text: "Yes", onPress: () => this.deletePotentialMatch(item.name, item.subtitle) },
                    { text: "No", type: "cancel" }
                ])}
        />
    )

    renderWaitingMatchesItem = ({ item }) => (
        <ListItem
            title={item.name}
            subtitle={item.subtitle}
            leftAvatar={{ source: { uri: item.avatar_url } }}
            bottomDivider
        />
    )

    keyExtractor = (item, index) => index.toString()

    /* -------------------------------------------------------------------------- */

    deleteCurrentMatch(inputString) {
        //console.log("Input: " + inputString);
        var partnerID = inputString.substring(inputString.indexOf("User ID") + 9, inputString.indexOf("in") - 1);
        //console.log("partnerID: " + partnerID);
        var partnerEventID = inputString.substring(inputString.indexOf("Current") + 8, inputString.indexOf("]"));
        //console.log("partnerEventID: " + partnerEventID);
        var myEventID = inputString.substring(inputString.indexOf("event ID:") + 10, inputString.indexOf("at") - 1);
        //console.log("myEventID: " + myEventID);

        let fetchURL = baseURL + "user/" + this.props.userID + "/matches/" + partnerID + "/" + myEventID + "/" + partnerEventID;
        //console.log(fetchURL);
        fetch(fetchURL, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.text())
            .then((responseJson) => {
                console.log("[deleteMatch] " + responseJson)
            }
         );

        var i;
        for (i = 0; i < this.props.currentMatches.length; i++) {
            if (this.props.currentMatches[i].subtitle === inputString) {
                this.props.deleteCurrentMatchesElement(i, 1);
                return;
            }
        }
    }

    deleteIncomingMatch(partnerID, inputString) {
        console.log("Input: " + partnerID + inputString);
        var eventID = inputString.substring(inputString.indexOf("event ID") + 10, inputString.indexOf("at") - 1);
        console.log("eventID: " + eventID);

        let fetchURL = baseURL + "user/" + this.props.userID + "/matches/" + partnerID + "/" + eventID;
        console.log(fetchURL);
        fetch(fetchURL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.text())
            .then((responseJson) => {
                console.log("[deleteMatch] " + responseJson)
            });

        var i;
        for (i = 0; i < this.props.incomingMatches.length; i++) {
            if (this.props.incomingMatches[i].subtitle === inputString) {
                var tmp = this.props.incomingMatches[i];
                tmp.subtitle.replace("Incoming", "Current");
                this.props.currentMatchesAdd(tmp);
                this.props.deleteIncomingMatchesElement(i, 1);
                return;
            }
        }
    }

    deletePotentialMatch(partnerID, inputString) {
        console.log("Input: " + partnerID + inputString);
        var eventID = inputString.substring(inputString.indexOf("event ID") + 10, inputString.indexOf("at") - 1);
        console.log("eventID: " + eventID);

        let fetchURL = baseURL + "user/" + this.props.userID + "/matches/" + partnerID + "/" + eventID;
        console.log(fetchURL);
        fetch(fetchURL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.text())
            .then((responseJson) => {
                console.log("[deleteMatch] " + responseJson)
            });

        var i;
        for (i = 0; i < this.props.potentialMatches.length; i++) {
            if (this.props.potentialMatches[i].subtitle === inputString) {
                console.log("here at: " + i);
                var tmp = this.props.potentialMatches[i];
                tmp.subtitle.replace("Potential", "Waiting");
                this.props.waitingMatchesAdd(tmp);
                this.props.deletePotentialMatchesElement(i, 1);
                return;
            }
        }
    }

    _onRefresh = () => {
        this.setState({ matchesRefreshing: true });

        this.props.currentMatchesClear();
        this.props.incomingMatchesClear();
        this.props.potentialMatchesClear();
        this.props.waitingMatchesClear();

        var i;
        for (i = 0; i < this.props.scheduleArray.length; i++) {
            let fetchURL = baseURL + "user/" + this.props.userID + "/matches/potentialMatches/" + this.props.scheduleArray[i].id;
            console.log("[matches refresh] fetchURL: " + fetchURL);
            fetch(fetchURL, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                /* First check if user, especially newly created ones have any schedules to initialize */
                .then((response) => response.text())
                .then((responseJson) => {
                    console.log("[matches refresh] responseJson: " + responseJson);
                    if (responseJson.includes("doesn't have any")) {
                        console.log("[matches refresh]: no matches for event " + i);
                    }
                    else {
                        /* Otw, we do the actual fetch */
                        fetch(fetchURL, {
                            method: "GET",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                //console.log("[initUserMatches] response: " + responseJson);
                                if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
                                    /* Populate data for current matches */
                                    if (responseJson[0].match === -1 || responseJson[0].match === null) {
                                        console.log("No current match for event " + responseJson[0].eventId);
                                    }
                                    else {
                                        var tmpMatch = {
                                            name: responseJson[0].matchName,
                                            avatar_url: "https://i.redd.it/q5d5fkvzqem31.jpg",
                                            subtitle: "[Current " + responseJson[0].eventMatch + "] " + "User ID: " + responseJson[0].match + " in event ID: " + responseJson[0].eventId + " at " + responseJson[0].time + ", " + responseJson[0].date,
                                        };
                                        this.props.currentMatchesAdd(tmpMatch);
                                    }

                                    /* Populate data for incoming matches */
                                    if (responseJson[0].request.length === 0) {
                                        console.log("No incoming match for event " + responseJson[0].eventId);
                                    }
                                    else {
                                        var i;
                                        for (i = 0; i < responseJson[0].request.length; i++) {
                                            var tmpMatch = {
                                                name: responseJson[0].request[i].toString(),
                                                avatar_url: "https://i.redd.it/q5d5fkvzqem31.jpg",
                                                subtitle: "[Incoming " + i + "] " + "In event ID: " + responseJson[0].eventId + " at " + responseJson[0].time + ", " + responseJson[0].date,
                                            }
                                            this.props.incomingMatchesAdd(tmpMatch);
                                        }
                                    }

                                    /* Populate data for potential matches */
                                    if (responseJson[0].potentialMatches.length === 0) {
                                        console.log("No potential match for event " + responseJson[0].eventId);
                                    }
                                    else {
                                        var i;
                                        for (i = 0; i < responseJson[0].potentialMatches.length; i++) {
                                            var tmpMatch = {
                                                name: responseJson[0].potentialMatches[i].toString(),
                                                avatar_url: "https://i.redd.it/q5d5fkvzqem31.jpg",
                                                subtitle: "[Potential " + i + "] " + "In event ID: " + responseJson[0].eventId + " at " + responseJson[0].time + ", " + responseJson[0].date,
                                            }
                                            this.props.potentialMatchesAdd(tmpMatch);
                                        }
                                    }

                                    /* Populate data for waiting matches */
                                    if (responseJson[0].wait.length === 0) {
                                        console.log("No waiting match for event " + responseJson[0].eventId);
                                    }
                                    else {
                                        var i;
                                        for (i = 0; i < responseJson[0].wait.length; i++) {
                                            var tmpMatch = {
                                                name: responseJson[0].wait[i].toString(),
                                                avatar_url: "https://i.redd.it/q5d5fkvzqem31.jpg",
                                                subtitle: "[Waiting " + i + "] " + "In event ID: " + responseJson[0].eventId + " at " + responseJson[0].time + ", " + responseJson[0].date,
                                            }
                                            this.props.waitingMatchesAdd(tmpMatch);
                                        }
                                    }
                                }
                            });
                    }
                });
        }
        this.setState({ matchesRefreshing: false });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
                {
                    <SafeAreaView testID="matchesView">
                        <ScrollView
                            testID="matchesScrollView"
                            refreshControl={
                                <RefreshControl
                                    testID="matchesRefresh"
                                    refreshing={this.state.matchesRefreshing}
                                    onRefresh={this._onRefresh}
                                />
                            }>
                            <View style={styles.container}>
                                <StatusBar
                                    barStyle="light-content"
                                    backgroundColor="#4286f4"
                                />
                                <View style={styles.navBar}>
                                    <Text style={styles.navBarTitle}>Matches</Text>
                                </View>
                            </View>

                            <View style={styles.safeContainer, { backgroundColor: "#4286f4" }}>
                                <Text style={{ fontSize: 18, flex: 1, margin: 8 }}>Current matches:</Text>
                            </View>
                          /*  <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.props.currentMatches}
                                renderItem={this.renderCurrentMatchesItem}
                            /> */

                            <View>
                            {
                                 this.props.currentMatches.map((l, i) => (
                                  <ListItem
                                       key={i}
                                       title={l.name}
                                       subtitle={l.subtitle}
                                       leftAvatar={{ source: { uri: l.avatar_url } }}
                                       bottomDivider
                                       chevron
                                       onPress={() => Alert.alert(l.name, "Do you want to accept this match?",
                                       [
                                       { text: "Yes", onPress: () => this.deleteIncomingMatch(l.name, l.subtitle) },
                                       { text: "No", type: "cancel" }
                                       ])}
                                    />
                                 ))
                            }
                            </View>

                            <View style={styles.safeContainer, { backgroundColor: "#4286f4" }}>
                                <Text style={{ fontSize: 18, flex: 1, margin: 8 }}>Incoming matches:</Text>
                            </View>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.props.incomingMatches}
                                renderItem={this.renderIncomingMatchesItem}
                            />

                            <View style={styles.safeContainer, { backgroundColor: "#4286f4" }}>
                                <Text style={{ fontSize: 18, flex: 1, margin: 8 }}>Potential matches:</Text>
                            </View>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.props.potentialMatches}
                                renderItem={this.renderPotentialMatchesItem}
                            />

                            <View style={styles.safeContainer, { backgroundColor: "#4286f4" }}>
                                <Text style={{ fontSize: 18, flex: 1, margin: 8 }}>Waiting matches:</Text>
                            </View>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.props.waitingMatches}
                                renderItem={this.renderWaitingMatchesItem}
                            />
                        </ScrollView>
                    </SafeAreaView>
                }
            </View>
        )
    }

}
