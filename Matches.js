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

/* For emulator */
export const baseURL =
    Platform.OS === "android"
        ? "http://10.0.2.2:3000/"
        : "http://localhost:3000/";

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
        };
    }

    /* -------------------------------------------------------------------------- */
    /* ListItem related methods */
    renderCurrentMatchesItem = ({ item }) => (
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
    )

    renderIncomingMatchesItem = ({ item }) => (
        <ListItem
            title={item.name}
            subtitle={item.subtitle}
            leftAvatar={{ source: { uri: item.avatar_url } }}
            bottomDivider
            chevron
            onPress={() => Alert.alert(item.name, "Do you want to accept this match?",
                [
                    { text: "Yes", onPress: () => this.deleteIncomingMatch(item.subtitle) },
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
                    { text: "Yes", onPress: () => this.deletePotentialMatch(item.subtitle) },
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
        //chevron
        //onPress={}
        />
    )

    keyExtractor = (item, index) => index.toString()

    /* -------------------------------------------------------------------------- */

    deleteCurrentMatch(inputString) {
        console.log("Input: " + inputString);
        var partnerID = inputString.substring(9, inputString.indexOf("in") - 1);
        console.log("partnerID: " + partnerID);
        var eventID = inputString.substring(inputString.indexOf("event ID") + 10, inputString.length);
        console.log("eventID: " + eventID);

        let fetchURL = baseURL + "user/" + this.props.userID + "/info";
        console.log(fetchURL);
        // fetch(fetchURL, {
        //     method: "DELETE",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //     },
        // })
        //     .then((response) => response.test())
        //     .then((responseJson) => {
        //         console.log("[deleteMatch] " + responseJson)
        //         if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
        //             this.props.yearLevelChange(responseJson[0].yearLevel);
        //             this.props.coursesChange(responseJson[0].courses);
        //             this.props.sexChange(responseJson[0].sex);
        //             this.props.numberOfRatingsChange(
        //                 responseJson[0].numberOfRatings
        //             );
        //             this.props.kindnessSelfRateChange(responseJson[0].kindness);
        //             this.props.patienceSelfRateChange(responseJson[0].patience);
        //             this.props.hardWorkingSelfRateChange(responseJson[0].hardWorking);
        //             this.props.authenticationTokenChange(
        //                 responseJson[0].authenticationToken
        //             );
        //             this.props.passwordChange(responseJson[0].password);
        //             this.props.emailChange(responseJson[0].email);
        //             this.props.nameChange(responseJson[0].name);
        //         }
        //         else {
        //             Alert.alert("Could not initialize user's info");
        //         }
        //     });

        //this.props.currentMatchesClear();
        var i;
        for (i = 0; i < this.props.currentMatches.length; i++) {
            if (this.props.currentMatches[i].subtitle === inputString) {
                this.props.deleteCurrentMatchesElement(i, 1);
                return;
            }
        }
    }

    deleteIncomingMatch(inputString) {
        console.log("Input: " + inputString);
        var partnerID = inputString.substring(9, inputString.indexOf("in") - 1);
        console.log("partnerID: " + partnerID);
        var eventID = inputString.substring(inputString.indexOf("event ID") + 10, inputString.length);
        console.log("eventID: " + eventID);

        let fetchURL = baseURL + "user/" + this.props.userID + "/info";
        console.log(fetchURL);
        // fetch(fetchURL, {
        //     method: "DELETE",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //     },
        // })
        //     .then((response) => response.test())
        //     .then((responseJson) => {
        //         console.log("[deleteMatch] " + responseJson)
        //         if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
        //             this.props.yearLevelChange(responseJson[0].yearLevel);
        //             this.props.coursesChange(responseJson[0].courses);
        //             this.props.sexChange(responseJson[0].sex);
        //             this.props.numberOfRatingsChange(
        //                 responseJson[0].numberOfRatings
        //             );
        //             this.props.kindnessSelfRateChange(responseJson[0].kindness);
        //             this.props.patienceSelfRateChange(responseJson[0].patience);
        //             this.props.hardWorkingSelfRateChange(responseJson[0].hardWorking);
        //             this.props.authenticationTokenChange(
        //                 responseJson[0].authenticationToken
        //             );
        //             this.props.passwordChange(responseJson[0].password);
        //             this.props.emailChange(responseJson[0].email);
        //             this.props.nameChange(responseJson[0].name);
        //         }
        //         else {
        //             Alert.alert("Could not initialize user's info");
        //         }
        //     });

        var i;
        for (i = 0; i < this.props.incomingMatches.length; i++) {
            if (this.props.incomingMatches[i].subtitle === inputString) {
                this.props.currentMatchesAdd(this.props.incomingMatches[i]);
                this.props.deleteIncomingMatchesElement(i, 1);
                return;
            }
        }
    }

    deletePotentialMatch(inputString) {
        console.log("Input: " + inputString);
        var partnerID = inputString.substring(9, inputString.indexOf("in") - 1);
        console.log("partnerID: " + partnerID);
        var eventID = inputString.substring(inputString.indexOf("event ID") + 10, inputString.length);
        console.log("eventID: " + eventID);

        let fetchURL = baseURL + "user/" + this.props.userID + "/info";
        console.log(fetchURL);
        // fetch(fetchURL, {
        //     method: "DELETE",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //     },
        // })
        //     .then((response) => response.test())
        //     .then((responseJson) => {
        //         console.log("[deleteMatch] " + responseJson)
        //         if (typeof responseJson !== "undefined" && typeof responseJson[0] !== "undefined") {
        //             this.props.yearLevelChange(responseJson[0].yearLevel);
        //             this.props.coursesChange(responseJson[0].courses);
        //             this.props.sexChange(responseJson[0].sex);
        //             this.props.numberOfRatingsChange(
        //                 responseJson[0].numberOfRatings
        //             );
        //             this.props.kindnessSelfRateChange(responseJson[0].kindness);
        //             this.props.patienceSelfRateChange(responseJson[0].patience);
        //             this.props.hardWorkingSelfRateChange(responseJson[0].hardWorking);
        //             this.props.authenticationTokenChange(
        //                 responseJson[0].authenticationToken
        //             );
        //             this.props.passwordChange(responseJson[0].password);
        //             this.props.emailChange(responseJson[0].email);
        //             this.props.nameChange(responseJson[0].name);
        //         }
        //         else {
        //             Alert.alert("Could not initialize user's info");
        //         }
        //     });

        var i;
        for (i = 0; i < this.props.potentialMatches.length; i++) {
            if (this.props.potentialMatches[i].subtitle === inputString) {
                console.log("here at: " + i);
                this.props.waitingMatchesAdd(this.props.potentialMatches[i]);
                this.props.deletePotentialMatchesElement(i, 1);
                return;
            }
        }
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
                                    refreshing={this.state.refreshing}
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

                            <View style={styles.safeContainer}>
                                <Text style={{ fontSize: 18, flex: 1, margin: 8 }}>Current matches:</Text>
                            </View>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.props.currentMatches}
                                renderItem={this.renderCurrentMatchesItem}
                            />

                            <View style={styles.safeContainer}>
                                <Text style={{ fontSize: 18, flex: 1, margin: 8 }}>Incoming matches:</Text>
                            </View>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.props.incomingMatches}
                                renderItem={this.renderIncomingMatchesItem}
                            />

                            <View style={styles.safeContainer}>
                                <Text style={{ fontSize: 18, flex: 1, margin: 8 }}>Potential matches:</Text>
                            </View>
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.props.potentialMatches}
                                renderItem={this.renderPotentialMatchesItem}
                            />

                            <View style={styles.safeContainer}>
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
