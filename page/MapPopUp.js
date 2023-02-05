import MapView, { Marker } from "react-native-maps";
import React, { useEffect } from 'react';
import { View, StyleSheet } from "react-native";

// const colorAr = [
//     '#ea7a72', '#c2c5d1', '#82a7c9',
//     '#d49d8f', '#ccd9c6', '#767676',
//     '#d1c8c3', '#dca47f', '#eb849c',
//     '#979dc1', '#c7d3c0',
// ]

const colorAr = [
    '#c2c5d1', '#ccd9c6', '#767676', '#d1c8c3', '#979dc1', '#c7d3c0',
]

const bgColor = (i) => colorAr[i % colorAr.length];

const Map = ({ route, navigation }) => {
    const { nama, latitude, longitude, index } = route.params;
    const color = bgColor(index);
    return (
        // <View style={styles.container}>
        <MapView style={[styles.map, { backgroundColor: bgColor(index) }]}
            initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            }}
            showsUserLocation={true}
            loadingEnabled={true}
            loadingIndicatorColor={"#595860"}
            mapType="satellite"

        ><Marker
                pinColor={color}
                coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                }}
                title={nama}
            />
        </MapView>
        // </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        height: '100%',
        width: "94%",
        marginLeft: "3%",
        marginRight: "3%",

    },
});
export default Map;
