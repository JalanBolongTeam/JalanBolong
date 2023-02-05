import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, ActivityIndicator } from 'react-native';
import Constants from "expo-constants";
import square_splash from '../assets/Square.png'

class splash extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.replace('Login');
        }, 3000)
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" ></StatusBar>
                <ActivityIndicator size={50} color="white" style={{transform: [{translateY: 430}]}}/>
                <Image style={{ width: 300, height: 300, borderRadius: 300, transform: [{translateY: -90}]}} source={square_splash}></Image>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#595860",
    },
})
export default splash;