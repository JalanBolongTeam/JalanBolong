import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ActivityIndicator
} from "react-native";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_400Regular_Italic,
} from "@expo-google-fonts/montserrat";
import Feather from "react-native-vector-icons/Feather";
import {
  doc,
  setDoc, updateDoc, getDocs, deleteDoc,
} from "firebase/firestore";
// import styles from "../page/Style";
import { db } from "./config";
import Icon, { Icons } from "../components/Icons";
import Colors from "../constants/Colors";

import * as ImagePicker from 'expo-image-picker';

// import {ImagePicker} from 'react-native-image-picker';
// import { storage } from 'firebase/app';
import { storage } from 'firebase/storage';

import profilePic from "../assets/Profilepic.png"

const Profil = (props, navigation) => {
  const usernameDB = props.route.params.username;
  const nameDB = props.route.params.name;
  const noDB = props.route.params.no;
  const emailDB = props.route.params.email;
  const imageDB = props.route.params.image;
  console.log(props);

  const [name, setName] = useState(nameDB);
  const [no, setNo] = useState(noDB);
  const [email, setEmail] = useState(emailDB);
  const [buttonName, setButtonName] = useState('Edit');
  const [iconButton, setIconButton] = useState("user-edit");
  const [iconType, setIconType] = useState("FontAwesome5");
  const [readOnly, setReadOnly] = useState(true);
  const [editable, setEditable] = useState(false);

  const [imageUri, setImageUri] = useState(imageDB);

  const [loading, setLoading] = useState(false);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_400Regular_Italic,
  });
  if (!fontsLoaded) {
    return null;
  }

  const updateUser = () => {
    // if (
    //   name.length === 0 ||
    //   no.length === 0 ||
    //   email.length === 0
    // ) {
    //   alert("Harap isi data dengan benar!!");
    // } else {
      setLoading(true);
      updateDoc(doc(db, "users", usernameDB), {
        name: name,
        no: no,
        email: email,
        image: imageUri,
      })
        .then(() => {
          console.log("data submitted");
          Alert.alert("Pengeditan Berhasil!");
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    // }
  };

  const changeButton = () => {
    if (buttonName === 'Edit') {
      setButtonName('Save');
      setIconButton("content-save-edit");
      setIconType("MaterialCommunityIcons");
      setReadOnly(!readOnly);
      setEditable(!editable);
    } else {
      updateUser();

      setButtonName('Edit');
      setIconType("FontAwesome5");
      setIconButton("user-edit");
      setReadOnly(!readOnly);
      setEditable(!editable);
    }
  }


  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      console.log(result);

      if (!result.canceled) {
        setImageUri(result.uri);
        // // upload image to firebase storage
        // const response = await fetch(result.uri);
        // const blob = await response.blob();
        var ref = storage.ref()("images/" + new Date().getTime() + ".jpg");
        const response = await fetch(result.uri);
        const blob = await response.blob();
        ref.put(blob)
          .then(async (response) => {
            // get downloadURL from firebase storage
            const downloadURL = await response.snapshot.ref.getDownloadURL();
            // update the user document in firestore
            setImageUri(downloadURL);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }

  };


  const deleteUser = () => {
    Alert.alert(
      "Hapus User",
      "Yakin menghapus akun anda ?",
      [
        {
          text: "Batal",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Hapus",
          onPress: () => {
            deleteDoc(doc(db, "users", usernameDB))
              .then(() => {
                console.log("User Deleted");
                Alert.alert("User Dihapus!");
                // Perform any additional actions here, such as navigating to a different screen
                props.navigation.replace("Login");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const quit = () => {
    Alert.alert(
      "Keluar",
      "Anda ingin keluar ?",
      [
        {
          text: "Tidak",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Ya",
          onPress: () =>
            setTimeout(() => {
              props.navigation.replace("Splash")
            }, 600),
        }
      ],
      { cancelable: false }
    );
  };


  return (
    <ScrollView style={{ backgroundColor: "#EFEFEF" }} >
      <View style={{
        flex: 1,
        backgroundColor: "#EFEFEF"
      }}>
        <View style={{ flex: 2 }}>
          <View style={styles.viewStyle}>
            <View
              style={{
                width: "100%",
                backgroundColor: "#595860",
                borderBottomStartRadius: 100,
                borderBottomEndRadius: 100,
                alignItems: "center",
              }}>

              <Text style={styles.textHeader}>{usernameDB}</Text>
              <Text style={styles.textSubHeader}>username</Text>

              <View style={{
                height: 130,
                width: 130,
                transform: [{ translateY: 50 }],
                backgroundColor: "#595860",
                borderRadius: 100,
                borderWidth: 5,
                borderColor: "#595860"
              }}>

                <Image
                  source={imageUri ? { uri: imageUri } : profilePic}
                  style={{
                    height: 120,
                    width: 120,
                    transform: [{ translateY: 0 }],
                    borderRadius: 100,
                  }}
                />
                {editable &&
                  <Pressable onPress={pickImage}>
                    <View style={{ transform: [{ translateY: -30 }] }}>
                      <View
                        style={{
                          height: 32, width: 32, backgroundColor: "#595860", borderRadius: 30,
                          borderWidth: 3, borderColor: "#EFEFEF",
                          transform: [{ translateX: 88 }]
                        }}
                      >
                        <View style={{ transform: [{ translateY: 3 }] }}>

                          <Icon
                            type={Icons.Octicons}
                            name="pencil"
                            size={18}
                            color={"#EFEFEF"}
                            style={{ transform: [{ translateX: 5 }] }}
                          >
                          </Icon>
                        </View>
                      </View>
                    </View>

                  </Pressable>
                }
              </View>

            </View>
          </View>

          <View style={{ flex: 10 }}>

            <Text style={styles.text}></Text>
            <View style={{ marginLeft: "10%", marginRight: "10%", marginTop: "7%", width: "80%" }}>
              <View style={{ marginTop: 28 }}>
                <View style={styles.inputStyle}>
                  <Icon
                    type={Icons.FontAwesome5}
                    name="user-alt"
                    color={"#595860"}
                    style={{ marginTop: 7 }}>
                  </Icon>
                  <TextInput
                    // placeholderTextColor={"#595860"}
                    // placeholder="Nama Lengkap"
                    autoCapitalize="none"
                    style={[styles.textInput, { marginLeft: 9, marginRight: 7 }]}
                    readOnly={readOnly} editable={editable}
                    onChangeText={(name) => setName(name)}
                  >
                    {name}
                  </TextInput>
                  {editable && <Icon
                    type={Icons.Octicons}
                    name="pencil"
                    size={15}
                    color={"#595860"}
                    style={{ marginTop: 18, marginRight: 10 }}>
                  </Icon>}
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.text}></Text>
                <View style={styles.inputStyle}>
                  <Icon
                    type={Icons.FontAwesome5}
                    name="phone-alt"
                    color={"#595860"}
                    style={{ marginTop: 7 }}>
                  </Icon>
                  <TextInput
                    // placeholderTextColor={"#595860"}
                    // placeholder="Nomor Telepon"
                    autoCapitalize="none"
                    style={[styles.textInput, { marginLeft: 9, marginRight: 7 }]}
                    readOnly={readOnly} editable={editable}
                    onChangeText={(no) => setNo(no)}
                  >
                    {no}
                  </TextInput>

                  {editable && <Icon
                    type={Icons.Octicons}
                    name="pencil"
                    size={15}
                    color={"#595860"}
                    style={{ marginTop: 18, marginRight: 10 }}>
                  </Icon>}
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.text}></Text>
                <View style={styles.inputStyle}>
                  <Icon
                    type={Icons.MaterialCommunityIcons}
                    name="email"
                    color={"#595860"}
                    style={{ marginTop: 9 }}>
                  </Icon>
                  <TextInput
                    // placeholderTextColor={"#595860"}
                    // placeholder="Email"
                    autoCapitalize="none"
                    style={[styles.textInput, { marginLeft: 9, marginRight: 7 }]}
                    readOnly={readOnly} editable={editable} email
                    onChangeText={(email) => setEmail(email)}
                  >
                    {email}
                  </TextInput>

                  {editable && <Icon
                    type={Icons.Octicons}
                    name="pencil"
                    size={15}
                    color={"#595860"}
                    style={{ marginTop: 18, marginRight: 10 }}>
                  </Icon>}

                </View>
              </View>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 10,
                paddingBottom: 30,
              }}>
                <Pressable
                  style={[styles.buttonBottom, { width: "33%" }]}
                  onPress={changeButton}
                >
                  <Icon
                    type={Icons[iconType]}
                    name={iconButton}
                    color="#595860"
                    value={buttonName}
                  >
                  </Icon>
                </Pressable>

                <Pressable style={[styles.buttonBottom, { width: "33%" }]}
                  onPress={deleteUser}>
                  <Icon
                    type={Icons.MaterialCommunityIcons}
                    name={"delete"}
                    size={31}
                    color="#595860"
                  ></Icon>
                </Pressable>

                <Pressable style={[styles.buttonBottom, { width: "33%" }]}
                  onPress={quit}>
                  <Icon
                    type={Icons.Entypo}
                    name={"log-out"}
                    size={27}
                    color="#595860"
                  ></Icon>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View >
      {loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={38} color="#595860"
            style={{ transform: [{ translateY: -403 }] }}
          />
        </View>
      )}
    </ScrollView>
  );
};
export default Profil;

const styles = StyleSheet.create({
  logo: {
    width: 260,
    height: 180,
    marginBottom: 10,
    justifyContent: "center",
  },
  viewStyle: {
    alignItems: "center",
    backgroundColor: "#EFEFEF",
  },
  inputStyle: {
    width: "100%",
    height: 48,
    borderRadius: 15,
    overflow: "hidden",
    borderColor: "#595860",
    borderBottomWidth: 3,
    backgroundColor: "#EFEFEF",
    // backgroundColor: Colors.white,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
    flexDirection: "row",
  },
  textInput: {
    // height: 50,
    color: "#595860",
    fontSize: 20,
    flex: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
    width: 150,
    borderRadius: 10,
    backgroundColor: "black",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    paddingBottom: 5,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    fontSize: 32,
    lineHeight: 39,
    fontFamily: "Montserrat_700Bold",
    letterSpacing: 0.25,
    color: "#595860",
  },
  textHeader: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 32,
    color: Colors.white,
    transform: [{ translateY: 30 }],
  },
  textSubHeader: {
    fontFamily: "Montserrat_400Regular_Italic",
    fontSize: 20,
    color: Colors.white,
    transform: [{ translateY: 25 }],
  },
  text: {
    fontFamily: "Montserrat_400Regular",
    fontSize: 16,
    color: "#595861",
  },
  textPress: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 16,
    color: "#595861",
  },
  buttonBottom: {
    marginTop: 20,
    backgroundColor: "#EFEFEF",
    color: "white",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    // width: "100%",
    borderRadius: 150,
    borderBottomColor: "#595860",
    borderBottomWidth: 2,
  },
});