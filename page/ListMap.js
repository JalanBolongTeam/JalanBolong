import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, RefreshControl, Image } from 'react-native'
import Styles from '../common/Styles';
import Colors from '../constants/Colors';
import MyHeader from '../components/MyHeader';
import { Button, List } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon, { Icons } from '../components/Icons';
import { Animations } from '../constants/Animations';
import { firebase } from "./fetch";
import logo from "../assets/login_bw.png"

// const colorAr = [
//   '#637aff', '#60c5a8', '#CCCCCC', '#ff5454',
//   '#039a83', '#dcb834', '#8f06e4', 'skyblue',
//   '#ff4c98',
// ]

const colorAr = [
  '#c2c5d1', '#ccd9c6', '#767676', '#d1c8c3', '#979dc1', '#c7d3c0',
]

const bgColor = (i) => colorAr[i % colorAr.length];


export default function ListScreen({ route, navigation }) {

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const maplistRef = firebase.firestore().collection('historyMap');
    maplistRef.onSnapshot((querySnapshot) => {
      const locations = [];
      querySnapshot.forEach((doc) => {
        const { nama, latitude, longitude, jalan, no, kelurahan, kecamatan, kota, provinsi, kodepos, image } = doc.data();
        locations.push({
          nama, latitude, longitude,
          jalan, no, kelurahan, kecamatan,
          kota, provinsi, kodepos, image,
        });
      });
      setLocations(locations);
    });
  }, []);

  const handlePress = useCallback((item, index) => {
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
    var index = index;

    // console.log(index, nama, latitude, longitude, jalan, no, kelurahan, kecamatan, kota, provinsi, kodepos);

    // navigation.navigate("DetailList", {
    navigation.navigate("DetailMapList", {
      item,
      nama, latitude, longitude,
      jalan, no, kelurahan, kecamatan,
      kota, provinsi, kodepos,
      index, image,
    });
  })

  const viewRef = useRef(null);
  const animation = Animations[Math.floor(Math.random() * Animations.length)]
  // console.log('====================================');
  // console.log(Math.floor(Math.random() * Animations.length), Math.random() * Animations.length, Animations.length);
  // console.log('====================================');

  const renderItem = ({ item, index }) => {
    return (
      <Animatable.View
        animation={animation}
        duration={1000}
        delay={index * 300}
        style={{ marginTop: 10 }}
      >
        <View style={styles.listItem}>
          <TouchableOpacity
            activeOpacity={0.7}
            // onPress={() => navigation.navigate('Screen')}>
            onPress={() => { handlePress(item, index); }}>
            <View style={[styles.image, { backgroundColor: bgColor(index) }]}>
            <Image
              source={item.image ? { uri: item.image } : logo}
              style={{height:144, width:148, borderRadius:10, 
                marginTop: 3, marginLeft:3,
              }}
            />
              {/* <Text style={styles.subname}>[{item.latitude}, {item.longitude}]</Text> */}
            </View>
          </TouchableOpacity>
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{item.nama}</Text>
            <Icon type={Icons.Feather} name="more-vertical" size={20} color={Colors.black} />
          </View>
        </View>
      </Animatable.View>
    )
  }

  const ListEmptyComponent = () => {
    const anim = {
      0: { translateY: -25 },
      0.5: { translateY: 50 },
      1: { translateY: -25 },
    }
    return (
      <View style={[styles.listEmpty]}>
        <Animatable.Text
          animation={anim}
          easing="ease-in-out"
          duration={3000}
          style={{ fontSize: 24 }}
          iterationCount="infinite">
          Loading...
        </Animatable.Text>
      </View>
    )
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      viewRef.current.animate({ 0: { opacity: 0.5, }, 1: { opacity: 1 } });
    })
    // ToastAndroid.show(animation+ ' Animation', ToastAndroid.SHORT);
    return () => unsubscribe;
  }, [navigation])

  const [refresh, setRefresh] = useState(false)

  const pullToRefresh = () => {
    setRefresh(true)
    setTimeout(() => {
      setRefresh(false)
    }, 1000)
  }

  return (
    <View style={[Styles.container]}>
      {/* <MyHeader
        back
        onPressBack={() => navigation.goBack()}
        title={route.name}
        right="more-vertical"
        onRightPress={() => console.log('right')}
      /> */}
      <Animatable.View
        ref={viewRef}
        easing={'ease-in-out'}
        duration={500}
        style={Styles.container}>
        <FlatList
          data={locations}
          keyExtractor={(_, i) => String(i)}
          numColumns={2}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => pullToRefresh()}
            />
          }
        />
      </Animatable.View>
    </View>
  )
}

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  subname: {
    fontWeight: "500",
    fontSize: 10,
    color: 'black',
    bottom: 5,
    position: 'absolute',
    left: "11%",
    right: "11%",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, .08)',
  },
  listEmpty: {
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    height: 210,
    width: Dimensions.get('window').width / 2 - 16,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 10,
  },
  image: {
    height: 150,
    margin: 5,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
