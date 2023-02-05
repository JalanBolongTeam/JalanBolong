import React, { Component } from "react";
import {
    Text,
    View,
    StyleSheet,
    Pressable,
    StatusBar,
    Animated,
    TextInput,
    Alert,
    ScrollView,
    Dimensions,
    Platform,
    Image,
    TouchableOpacity,
    ImageBackground,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db } from "./config";
import { firebase } from "./fetch";
import { setDoc, doc } from "firebase/firestore";
import ListMap from "./ListMap";
import { FlatList } from "react-native-gesture-handler";
import AddLocation from "./AddLocation";
import logo from "../assets/login_bw.png"
import Icon from "../components/Icons";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 180;
const CARD_WIDTH = width * 0.65;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.handlePress = this.handlePress.bind(this);
    }
    state = {
        nama: "",
        mapRegion: null,
        hasLocationPermissions: false,
        locationResult: null,
        hasilLongitude: 0,
        hasilLatitude: 0,
        mapIndex: 0,
        mapAnimation: new Animated.Value(0),
        locations: [],
    };
    componentDidMount() {
        if (Platform.OS === "android" && !Constants.isDevice) {
            this.setState({
                errorMessage:
                    "Oops, this will not work on Sketch in an Android emulator. Try it on your device!",
            });
        } else {
            this._getLocationAsync();
            const mapHistoryRef = firebase.firestore().collection("historyMap");
            mapHistoryRef.onSnapshot((querySnapshot) => {
                const locations = [];
                querySnapshot.forEach((doc) => {
                    const {
                        nama,
                        latitude,
                        longitude,
                        jalan,
                        no,
                        kelurahan,
                        kecamatan,
                        kota,
                        provinsi,
                        kodepos,
                        image
                    } = doc.data();
                    locations.push({
                        nama,
                        latitude,
                        longitude,
                        jalan,
                        no,
                        kelurahan,
                        kecamatan,
                        kota,
                        provinsi,
                        kodepos,
                        image
                    });
                });
                this.setState({ locations });
                console.log(locations);
            });
        }
    }

    _handleMapRegionChange = (mapRegion) => {
        console.log(mapRegion);
        this.setState({ mapRegion });
    };

    _getLocationAsync = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            this.setState({
                locationResult: "Permission to access location was denied",
            });
        } else {
            this.setState({ hasLocationPermissions: true });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ locationResult: JSON.stringify(location) });
        this.setState({
            hasilLongitude: location.coords.longitude,
            hasilLatitude: location.coords.latitude,
        });

        // Center the map on the location we just fetched.
        this.setState({
            mapRegion: {
                // latitude: 22.62938671242907,
                // longitude: 88.4354486029795,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            },
        });
    };

    handlePress = (item) => {
        console.log({ item });
        var nama = item.nama;
        var latitude = item.latitude;
        var longitude = item.longitude;
        var jalan = item.jalan;
        var no = item.no;
        var kelurahan = item.kelurahan;
        var kecamatan = item.kecamatan;
        var kota = item.kota;
        var provinsi = item.provinsi;
        var kodepos = item.kodepos;
        var image = item.image;
        console.log(
            nama,
            latitude,
            longitude,
            jalan,
            no,
            kelurahan,
            kecamatan,
            kota,
            provinsi,
            kodepos,
            image
        );

        this.props.navigation.navigate("DetailHome", {
            nama,
            latitude,
            longitude,
            jalan,
            no,
            kelurahan,
            kecamatan,
            kota,
            provinsi,
            kodepos,
            image
        });
    };

    moveAdd = () => {
        this.props.navigation.navigate("AddLocation");
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.container}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    loadingEnabled={true}
                    loadingIndicatorColor={"#595860"}
                    toolbarEnabled={true}
                    initialRegion={this.state.mapRegion}
                    onRegionChange={this._handleMapRegionChange}
                >
                    {this.state.locations.map((location) => (
                        <Marker
                            key={[location.nama]}
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            title={location.nama}
                            description={`${location.kecamatan}, ${location.kota}`}
                        >

                            {/* <Callout tooltip={true}>
                                <View>
                                    <View style={styles.bubble}>
                                        <Text style={styles.nama}>{location.nama}</Text>
                                        <Image style={styles.image} source={`${location.image}` ? { uri: `${location.image}` } : logo} />
                                    </View>
                                    <View style={styles.arrowBorder}></View>
                                    <View style={styles.arrow}></View>
                                </View>
                            </Callout> */}

                        </Marker>

                    ))}

                </MapView>
                {/* <View style={[styles.searchBar]}>
                    <TextInput
                        placeholder="Search here"
                        placeholderTextColor="#000"
                        autoCapitalize="none"
                        style={{ flex: 1, padding: 0 }}
                    />
                    <Ionicons name="ios-search" size={20} />
                </View> */}

                <Animated.ScrollView
                    horizontal
                    pagingEnabled
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH + 20}
                    snapToAlignment="center"
                    style={styles.scrollView}
                    contentInset={{
                        top: 0,
                        left: SPACING_FOR_CARD_INSET,
                        bottom: 0,
                        right: SPACING_FOR_CARD_INSET,
                    }}
                    contentContainerStyle={{
                        paddingHorizontal:
                            Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
                    }}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        x: this.state.mapAnimation,
                                    },
                                },
                            },
                        ],
                        { useNativeDriver: true }
                    )}
                >
                    {/* <View> */}

                    <FlatList
                        style={{ height: "100%" }}
                        data={this.state.locations}
                        numColumn={1}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    this.handlePress(item);
                                }}
                            >
                                <View style={styles.card}>
                                    <Image style={styles.cardImage} resizeMode="cover"
                                        source={item.image ? { uri: item.image } : logo}
                                    />
                                    <View style={styles.textContent}>
                                        <Text style={styles.cardtitle}>{item.nama}</Text>
                                        <Text style={styles.cardDescription}>
                                            {item.latitude}, {item.longitude}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        contentContainerStyle={{ flexDirection: "row" }}
                    ></FlatList>
                </Animated.ScrollView>




                <View style={styles.addButton}>
                    <Pressable onPress={this.moveAdd}>
                        <View style={styles.button}>
                            {/* <Icon
                            type={Icon.Ionicons}
                            size={25}
                            name={"md-add-circle-outline"}
                            color={"white"}></Icon> */}
                            <Text style={{ color: "white", fontSize: 30 }}>+</Text>

                        </View>
                    </Pressable>
                </View>

                {/* <View style={styles.locButton}>
                    <Pressable onPress={this._getLocationAsync}>
                        <View style={styles.button}>
                            <Icon
                            type={Icon.MaterialIcons}
                            size={25}
                            name={"gps-fixed"}
                            color={"white"}></Icon>
                            <Text style={{ color: "white", fontSize: 30 }}>O</Text>
                        </View>
                    </Pressable>
                </View> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        width: "100%",
    },
    searchBar: {
        position: "absolute",
        flexDirection: "row",
        backgroundColor: "#fff",
        width: "75%",
        height: 40,
        marginTop: 20,
        // transform: [{ translateX: -25 }],
        left: 40,
        transform: [{ translateY: -9 }],
        marginLeft: -8,
        borderRadius: 5,
        padding: 10,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    addButton: {
        position: "absolute",
        bottom: -33,
        right: 7,
        // paddingVertical: 300,
        marginBottom: 300,

    },
    locButton: {
        position: "absolute",
        bottom: 0,
        left: 3,
        // paddingVertical: 300,
        marginBottom: 300,
    },
    button: {
        backgroundColor: "#595861",
        width: 45,
        height: 45,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 100,
    },
    card: {
        // padding: 10,
        elevation: 2,
        backgroundColor: "#FFF",
        borderRadius: 15,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: 160,
        width: CARD_WIDTH,
        overflow: "hidden",
        marginRight: 0,
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 2,
        padding: 10,
    },
    cardtitle: {
        fontSize: 12,
        // marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    bubble: {
        flexDirection: "column",
        alignSelf: "flex-start",
        backgroundColor: "#fff",
        borderRadius: 6,
        borderWidth: 0.5,
        padding: 15,
        width: 150,
    },
    name: {
        fontSize: 16,
        marginBottom: 5,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: "#fff",
        borderWidth: 16,
        alignSelf: "center",
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: "#007a87",
        borderWidth: 16,
        alignSelf: "center",
        marginTop: -0.5,
        // marginBottom: -15,
    },
    image: {
        width: 120,
        height: 80,
    }
});