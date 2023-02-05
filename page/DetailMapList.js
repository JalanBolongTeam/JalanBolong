import React, { useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'
import Icon, { Icons } from '../components/Icons'
import MyHeader from '../components/MyHeader'
import Colors from '../constants/Colors'
import logo from "../assets/login_bw.png"

const { width, height } = Dimensions.get('window');

// const colorAr = [
//   '#637aff', '#60c5a8', '#CCCCCC', '#ff5454',
//   '#039a83', '#dcb834', '#8f06e4', 'skyblue',
//   '#ff4c98',
// ]

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

export default function DetailsScreen({ route, navigation }) {
    const { nama, latitude, longitude,
        jalan, no, kelurahan, kecamatan,
        kota, provinsi, kodepos, index, image } = route.params;


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            StatusBar.setBackgroundColor(bgColor(index));
            StatusBar.setBarStyle('light-content')
        })
        return () => unsubscribe;
    }, [navigation])
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            StatusBar.setBackgroundColor(bgColor(index));
            StatusBar.setBarStyle('light-content')
        })
        return () => unsubscribe;
    }, [navigation])
    const handlePress = (nama, latitude, longitude, index, navigation) => {
        // console.log({ item });
        var nama = nama;
        var latitude = latitude;
        var longitude = longitude;
        console.log(nama, latitude, longitude);
        navigation.navigate("MapPopUp", {
            nama,
            latitude,
            longitude,
            index,
        });
    }

    return (
        <View style={[styles.container, { backgroundColor: bgColor(index) }]}>
            <MyHeader
                back
                onPressBack={() => navigation.goBack()}
                title={route.name}
                right="more-vertical"
                // optionalBtn="shopping-cart"
                headerBg={bgColor(index)}
                iconColor={Colors.white}
                onRightPress={() => console.log('right')}
            />
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View>
                        <Text style={styles.smallText}>#TagLokasi</Text>
                        <Text style={styles.bigText}>{nama}</Text>
                    </View>
                    <View>
                        <Text style={styles.smallText}>Kode Pos</Text>
                        <Text style={styles.bigText}>{kodepos}</Text>
                    </View>
                </View>
                <SharedElement style={styles.imageContainer}>
                    {/* <Image source={item.image} style={[styles.image, { backgroundColor: bgColor(index), borderColor: Colors.black,}] } resizeMode='center' /> */}
                    <Image style={[styles.image, { backgroundColor: bgColor(index), borderColor: Colors.white, }]} resizeMode='center'

                        source={image ? { uri: image } : logo}
                    />
                    <Image style={styles.image} resizeMode='center' />
                </SharedElement>
                <View style={styles.bottomContainer}>
                    <View style={styles.descriptionContainer}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Rincian</Text>
                        <Text style={{ fontWeight: '500', marginBottom: 10 }}>Alamat</Text>
                        <Text>{jalan} No {no}, Kelurahan {kelurahan}, {kecamatan}, {kota}, {provinsi} {kodepos}</Text>
                        <Text style={{ fontWeight: '500', marginTop: 10, marginBottom: 10 }}>Geolokasi</Text>
                        <Text>Latitude : {latitude}, Longitude: {longitude}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, position: 'absolute', bottom: 0, alignSelf: 'center' }}>
                        <TouchableOpacity style={[styles.cartBtm, { borderColor: bgColor(index) }]}>
                            <Icon type={Icons.Entypo} name="location" color={bgColor(index)} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, { backgroundColor: bgColor(index) }]} onPress={() => { handlePress(nama, latitude, longitude, index, navigation); }}>
                            <Text style={styles.btnText}>Check Location</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

DetailsScreen.sharedElements = (route) => {
    const { item } = route.params;

    return [
        {
            id: `item.${item.id}.image`,
            animation: 'move',
            resize: 'clip',
        }
    ]
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        height: height / 3,
        padding: 16,
        justifyContent: 'space-between',
    },
    bottomContainer: {
        padding: 16,
        flex: 1,
        backgroundColor: Colors.white,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingTop: 80,
    },
    bigText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.white,
    },
    smallText: {
        color: Colors.white,
    },
    image: {
        marginTop: 50,
        marginRight: 15,
        width: width / 1.7,
        height: width / 1.7,
        borderRadius: 17,
        borderWidth: 3,
    },
    imageContainer: {
        position: 'absolute',
        zIndex: 999,
        top: 60,
        alignSelf: 'flex-end',
    },
    colorBtn: {
        height: 16,
        width: 16,
        borderRadius: 6,
    },
    outerCircle: {
        height: 24,
        width: 24,
        borderRadius: 6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    variants: {
        flexDirection: 'row',
        marginVertical: 20,
        justifyContent: 'space-between',
    },
    descriptionContainer: {
        marginVertical: 10,
    },
    quantity: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    qtBtn: {
        borderWidth: 1,
        borderColor: Colors.darkGray,
        borderRadius: 8,
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    favoriteBtn: {
        borderRadius: 17,
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBtm: {
        borderRadius: 10,
        width: 50,
        height: 45,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    btn: {
        flex: 1,
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.white,
    },
})
