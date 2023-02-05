import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  logo: {
    width: 260,
    height: 180,
    marginBottom: 10,
    justifyContent: "center",
  },
  viewStyle: {
    alignItems: "center",
    backgroundColor: "#595861",
  },
  inputStyle: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#DBDBDB",
    backgroundColor: "#EFEFEF",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16,
    flexDirection: "row",
  },
  textInput: {
    // height: 50,
    color: "black",
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
    color: "white",
  },
  textHeader: {
    fontFamily: "Montserrat_700Bold",
    fontSize: 32,
    color: "#595861",
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
  loginButton: {
    marginTop: 20,
    backgroundColor: "#595861",
    color: "white",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: 150,
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: "#595861",
    color: "white",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: 150,
  },
});

export default styles;