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
} from "react-native";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import Feather from "react-native-vector-icons/Feather";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import styles from "./Style";
import { db } from "./config";

import logoLogin from "../assets/login.png"

const Register = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  const insertNewUser = () => {
    if (
      username.length === 0 ||
      password.length === 0 ||
      confirmPw.length === 0
    ) {
      alert("Harap isi data dengan benar!!");
    } else if (password !== confirmPw) {
      Alert.alert("Password tidak cocok!!");
    } else {
      setDoc(doc(db, "users", username), {
        username: username,
        password: password,
      })
        .then(() => {
          console.log("data submitted");
          Alert.alert("Pendaftaran Berhasil!");
          props.navigation.navigate("Login");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const updateConfirmSecureTextEntry = () => {
    setConfirmSecureTextEntry(!confirmSecureTextEntry);
  };
  return (
    <ScrollView style={{backgroundColor: "white"}}>
      <View style={styles.viewStyle}>
        <View
          style={{
            width: "100%",
            marginTop: 100,
            backgroundColor: "white",
            borderTopStartRadius: 51,
            borderTopEndRadius: 51,
            alignItems: "center",
            flex: 1,
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
            <Text style={styles.textHeader}>Register</Text>
            <View style={{ marginTop: 28 }}>
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
            <View style={{ marginTop: 10 }}>
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
            <View style={{ marginTop: 10 }}>
              <Text style={styles.text}>Confirm Password</Text>
              <View style={styles.inputStyle}>
                <TextInput
                  placeholderTextColor="#aaaaaa"
                  autoCapitalize="none"
                  style={styles.textInput}
                  secureTextEntry={secureTextEntry ? true : false}
                  onChangeText={(confirmPw) => setConfirmPw(confirmPw)}
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
              <Text style={styles.text}>Sudah punya akun? </Text>
              <Pressable onPress={() => props.navigation.navigate("Login")}>
                <Text style={styles.textPress}>masuk disini</Text>
              </Pressable>
            </View>
            <Pressable style={styles.registerButton} onPress={insertNewUser}>
              <Text style={styles.textButton}>Daftar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default Register;