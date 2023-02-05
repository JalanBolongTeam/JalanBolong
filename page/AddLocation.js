import React, { Component, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Pressable,
    StatusBar,
    TextInput,
    Alert,
    Image,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { db } from "./config";
import { setDoc, doc, connectFirestoreEmulator } from "firebase/firestore";
import * as storage from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import {debounce} from 'lodash';


export default class AddLocation extends Component {
    constructor(props) {
        super(props);
        this.pickImage = this.pickImage.bind(this);
    }
    state = {
        nama: "",
        mapRegion: null,
        hasLocationPermissions: false,
        locationResult: null,
        addressResult: null,
        hasilLongitude: 0,
        hasilLatitude: 0,
        jalan: "",
        no: "",
        kelurahan: "",
        kecamatan: "",
        kota: "",
        provinsi: "",
        kodepos: "",
        imageUri: "",
        previousLocation: {},
    };


    componentDidMount() {
        if (Platform.OS === "android" && !Constants.isDevice) {
            this.setState({
                errorMessage:
                    "Oops, this will not work on Sketch in an Android emulator. Try it on your device!",
            });
        } else {
            this._getLocationAsync();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Only update the component if the mapRegion has changed
        return nextState.mapRegion !== this.state.mapRegion;
    }



    _handleMapRegionChange = debounce( async (mapRegion) => {

        // requestAnimationFrame(async () => {
            console.log(mapRegion);
            this.setState({ mapRegion });

            let address = await Location.reverseGeocodeAsync(mapRegion);
            this.setState({
                jalan: address[0].street,
                no: address[0].streetNumber,
                kelurahan: address[0].district,
                kecamatan: address[0].city,
                kota: address[0].subregion,
                provinsi: address[0].region,
                kodepos: address[0].postalCode,
            });

            this.setState({
                hasilLongitude: mapRegion.longitude,
                hasilLatitude: mapRegion.latitude,
            });

            console.log(address);
        // });
    });

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
        console.log(location);

        //get address
        let address = await Location.reverseGeocodeAsync(location.coords);
        // console.log(address[0].city);


        this.setState({ locationResult: JSON.stringify(location) });
        this.setState({
            hasilLongitude: location.coords.longitude,
            hasilLatitude: location.coords.latitude,
        });

        // Center the map on the location we just fetched.
        this.setState({
            mapRegion: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            },
            jalan: address[0].street,
            no: address[0].streetNumber,
            kelurahan: address[0].district,
            kecamatan: address[0].city,
            kota: address[0].subregion,
            provinsi: address[0].region,
            kodepos: address[0].postalCode,
        });


        this.setState({ addressResult: JSON.stringify(address) });
    };

    InsertMap = () => {
        var nama = this.state.nama;
        var latitude = this.state.hasilLatitude;
        var longitude = this.state.hasilLongitude;


        setDoc(doc(db, "historyMap", nama), {
            nama: nama,
            latitude: latitude,
            longitude: longitude,
            jalan: this.state.jalan,
            no: this.state.no,
            kelurahan: this.state.kelurahan,
            kecamatan: this.state.kecamatan,
            kota: this.state.kota,
            provinsi: this.state.provinsi,
            kodepos: this.state.kodepos,
            image: this.state.imageUri,

        })
            .then(() => {
                console.log("data submitted");
                Alert.alert("Data Berhasil Disimpan");
                this.props.navigation.goBack();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    async pickImage() {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            console.log(result);
            if (!result.canceled) {
                this.setState({ imageUri: result.assets[0].uri });
                console.log(this.state.imageUri);
                var ref = storage.ref("images/" + new Date().getTime() + ".jpg");
                const response = await fetch(result.uri);
                const blob = await response.blob();
                ref.put(blob)
                    .then(async (response) => {
                        // get downloadURL from firebase storage
                        const downloadURL = await response.snapshot.ref.getDownloadURL();
                        // update the user document in firestore
                        this.setState({ imageUri: downloadURL });
                        console.log(this.state.imageUri);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={"#423f5a"} barStyle="light-content"></StatusBar>

                {this.state.locationResult === null ? (
                    <Text style={styles.regular}>Finding your current location...</Text>
                ) : this.state.hasLocationPermissions === false ? (
                    <Text style={styles.regular}>
                        Location permissions are not granted.
                    </Text>
                ) : this.state.mapRegion === null ? (
                    <Text style={styles.regular}>Map region doesn't exist.</Text>
                ) : (
                    <MapView
                        mapType="satellite"
                        loadingEnabled={true}
                        loadingIndicatorColor={"#595860"}
                        showsUserLocation={true}
                        provider={PROVIDER_GOOGLE}
                        style={{
                            width: "95%",
                            height: "70%",
                            marginTop: -30,
                        }}
                        region={this.state.mapRegion}
                        onRegionChange={this._handleMapRegionChange}
                    >
                        <Marker pinColor={"red"} coordinate={this.state.mapRegion} />
                    </MapView>
                )}
                <View style={styles.inputStyle}>
                    <TextInput
                        placeholder="Nama Lokasi"
                        placeholderTextColor="#aaaa"
                        style={styles.textInput}
                        onChangeText={(nama) => this.setState({ nama })}
                    />
                </View>

                <Pressable onPress={this.pickImage}>
                    <View style={[styles.inputStyle, { width: "60%" }]}>
                        <Text style={[styles.textInput, { transform: [{ translateX: 52 }], marginTop: 15, fontWeight: "bold" }]}>
                            Pilih Gambar
                        </Text>
                    </View>
                </Pressable>

                <View
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                    }}
                >
                    <Pressable
                        style={styles.currentButton}
                        onPress={this._getLocationAsync}>
                        <Image style={{ width: 30, height: 30 }} source={require("../assets/location.png")}></Image>
                    </Pressable>
                    <Pressable
                        style={styles.saveButton}
                        onPress={() => {
                            this.InsertMap();
                        }}
                    >
                        <Image style={{ width: 30, height: 30 }} source={require("../assets/save.png")}></Image>
                        {/* <Text style={styles.regular}>Simpan Lokasi</Text> */}
                    </Pressable>
                    {/* <Pressable
                        style={styles.historyButton}
                        onPress={() => {
                            this.props.navigation.navigate("ListMap");
                        }}
                    >
                        <Image style={{ width: 30, height: 30 }} source={require("../assets/data.png")}></Image>

                    </Pressable> */}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "white",
    },
    paragraph: {
        margin: 10,
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        color: "black",
    },
    regular: {
        fontSize: 12,
        textAlign: "center",
        color: "white",
    },
    currentButton: {
        margin: 20,
        backgroundColor: "#737486",
        color: "white",
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        width: "15%",
        borderRadius: 20,
    },
    saveButton: {
        margin: 20,
        backgroundColor: "#ac6c8d",
        color: "white",
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        width: "15%",
        borderRadius: 20,
    },
    historyButton: {
        margin: 20,
        backgroundColor: "#6e688e",
        color: "white",
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        width: "15%",
        borderRadius: 20,
    },
    inputStyle: {
        width: "80%",
        height: 48,
        borderRadius: 15,
        overflow: "hidden",
        backgroundColor: "gray",
        marginTop: 20,
        paddingLeft: 16,
        flexDirection: "row",
    },
    textInput: {
        height: 50,
        color: "white",
        fontSize: 14,
        flex: 1,
    },
});
