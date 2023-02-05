import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import Feather from "react-native-vector-icons/Feather";
import { getDocs, collection, doc, where, query } from "firebase/firestore";
import styles from "./Style";
import { db } from "./config";
// import Profil from "../screens/Profil";
import logoLogin from "../assets/login.png"

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dbusername, setDBUsername] = useState("");
  const [dbpassword, setDBPassword] = useState("");
  const [dbimage, setDBImage] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const [loading, setLoading] = useState(true);


  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }

  const getUser = () => {
    if (username.length == 0 || password.length == 0) {
      alert("Harap isi data dengan benar!!");
    } else {
      getDocs(
        query(collection(db, "users"), where("username", "==", username))
      ).then((docSnap) => {
        let users = [];
        docSnap.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
        setDBUsername(users[0].username);
        setDBPassword(users[0].password);
        if (username === dbusername && password === dbpassword) {
          Alert.alert("Success", "Login Berhasil");
          console.log("Documen Data: ", users[0].username, users[0].password);

          props.navigation.replace("Tab", {
            username: users[0].username,
            name: users[0].name,
            no: users[0].no,
            email: users[0].email,
            image: users[0].image
          });

        } else {
          Alert.alert("Error", "Login Gagal");
        }
      })
        .catch((error) => {
          console.log(error);
          Alert.alert("Error", "Login Gagal");
        });
    }
  };

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };



  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      
      
      <View style={styles.viewStyle}>
        <View
          style={{
            width: "100%",
            marginTop: 170,
            backgroundColor: "white",
            borderTopStartRadius: 51,
            borderTopEndRadius: 51,
            alignItems: "center",
          }}
        >
          <Image
            source={logoLogin}
            style={{
              height: 114,
              width: 114,
              marginTop: -60,
            }}
          />
          <View style={{ margin: 40, width: "80%" }}>
            <Image />
            <Text style={styles.textHeader}>Login</Text>
            <View style={{ marginTop: 38 }}>
              <Text style={styles.text}>Username</Text>
              <View style={styles.inputStyle}>
                <TextInput
                  placeholderTextColor="#aaaaaa"
                  autoCapitalize="none"
                  style={styles.textInput}
                  onChangeText={(username) => setUsername(username)}
                />
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.text}>Password</Text>
              <View style={styles.inputStyle}>
                <TextInput
                  placeholderTextColor="#aaaaaa"
                  autoCapitalize="none"
                  style={styles.textInput}
                  secureTextEntry={secureTextEntry ? true : false}
                  onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {secureTextEntry ? (
                    <Feather
                      name="eye-off"
                      color="grey"
                      size={20}
                      style={{ margin: 10 }}
                    />
                  ) : (
                    <Feather
                      name="eye"
                      color="black"
                      size={20}
                      style={{ margin: 10 }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>Tidak punya akun? </Text>
              <Pressable onPress={() => props.navigation.navigate("Register")}>
                <Text style={styles.textPress}>daftar disini</Text>
              </Pressable>
            </View>
            <Pressable style={styles.loginButton} onPress={getUser}>
              <Text style={styles.textButton}>Masuk</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default Login;