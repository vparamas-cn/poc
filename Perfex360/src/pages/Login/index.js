import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image,Alert } from "react-native";
import Container from "../../components/Container"
import { Theme, wp, hp, fontsize, Bg } from '../../lib/constants';
import RNExitApp from 'react-native-exit-app';
import Button from "../../components/Button"
import Joi from 'react-native-joi'
import { connect } from 'react-redux'
import { login } from '../../redux/actions/auth.actions'

const Login = props => {
  const [data, setData] = useState({ username: undefined, password: undefined })
  const [secure, setSecure] = useState(true)
  const login = () => {
    Joi.validate(data, schema, (err, value) => {
      if (err) return Alert.alert('UserName and Password is required!')
      props.login(value)
    })
   }

  const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
  })
  const reset =() =>{
    setData({ username: undefined, password: undefined })
  }
  return (
    <Container>
      <View style={styles.container}>
       <View style={styles.exit}><TouchableOpacity onPress={() => { RNExitApp.exitApp() }} style={styles.exitholder}><Text style={styles.exittxt}>Exit</Text><Image style={styles.exitImage} source={require("../../assets/icons/exit.png")} /></TouchableOpacity></View>
        <View style={styles.background}>
          <Image style={styles.logo} source={require("../../assets/icons/logo.png")}></Image>
          <View style={styles.inputcontainer}>
            <TextInput style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Username"
              placeholderTextColor={"#00000099"}
              autoCapitalize="none"
              value={data.username}
              onChangeText={val => setData({ ...data, username: val })} />
            <View style={styles.btnimage}>
              <TextInput style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="Password"
                placeholderTextColor={"#00000099"}
                autoCapitalize="none"
                value={data.password}
                secureTextEntry={secure}
                onChangeText={val => setData({ ...data, password: val })} />
              <TouchableOpacity activeOpacity={.5} style={styles.inputbtn} onPress={()=>setSecure(!secure)} ><Image  source={require("../../assets/icons/eye.png")} /></TouchableOpacity>
            </View>
          </View>
          <View style={styles.button}>
            <Button onPress={login} buttonText="Login" loading={false} />
          </View>
          <View style={styles.resetcontainer}><TouchableOpacity onPress={reset} style={styles.resetbtn}><Image style={styles.resetimg} source={require("../../assets/icons/reset.png")} /><Text style={styles.resettext}>Reset</Text></TouchableOpacity></View>
        </View>
        <View style={styles.footer}><Text style={styles.footertxt}>Copyrights 2020 Perfex360</Text></View>
      </View>
    </Container>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", backgroundColor: Bg, height: hp("100%"), paddingVertical: hp("5%"), paddingHorizontal: wp("5%"),
    position: "relative"
  },
  background: {
    justifyContent: "flex-start",

  },
  btnimage: {
    position: "relative"
  },
  inputbtn: {
    position: "absolute",
    top: hp("1.8%"),
    right: 12
  },
  resetbtn: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    backgroundColor:"#eaeaea",
    height:hp("5.5%"),
    borderRadius:hp("2.75%"),
    width:wp("25%"),
    paddingHorizontal:wp("2%")
  },
  exitholder: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  exit: {
    position: "absolute",
    width: wp("100%"),
    top: hp("3%"),

  },
  exittxt: {
    fontSize: fontsize(3),
    color: "#474747"
  },
  footer: {
    position: "absolute",
    width: wp("100%"),
    bottom: hp("5%"),
    alignItems: "center"
  },
  footertxt: {
    fontSize: fontsize(2),
    color: "#474747"
  },
  logo: {
    resizeMode: "contain",
    width: wp("56%"),
    height: wp("15.4%"),
    padding: 0
  },
  exitImage: {
    resizeMode: "contain",
    height: wp("7%"),
    width: wp("7%"),
    marginRight: wp("5%")
  },
  button:{

    justifyContent:"center",
    alignItems:"center",
    paddingHorizontal: hp("3.5%"),
},
  inputcontainer: {
    paddingTop: hp('2%'),
    paddingHorizontal: hp("3.5%"),
  },
  input: {
    marginBottom: hp('3%'),
    height: hp("7%"),
    borderColor: Theme,
    borderWidth: 1,
    width: wp("77%"),
    borderRadius: 5,
    paddingLeft: wp("3%"),
    fontSize: fontsize(1.9),
    color: Theme
  },
  
  title: {
    fontSize: fontsize(3.75),
    color: "#ffffff",
    marginBottom: hp("3%")
  },
  panel: {
    width: wp('100%'),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: hp('25%'),
    backgroundColor: "transparent"
  },
  panelbox: {
    width: wp('90%'),
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: hp('5%')
  },
  titletxt: {
    fontSize: fontsize(3),
    fontWeight: "bold"
  },
  resetcontainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    paddingTop: hp('2%'),
    marginHorizontal: hp("3.5%"),
  },
  reset: {
    fontSize: fontsize(2),
    textDecorationStyle: "solid"
  }
})
const mstp = state => ({ user: state.user })
export default connect(mstp, { login })(Login)
