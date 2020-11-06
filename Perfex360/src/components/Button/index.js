import React from "react";
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import {  wp, hp,fontsize } from '../../lib/constants';
import LinearGradient from 'react-native-linear-gradient';

const Button = (props) => {
    
  return(
    props.loading?
    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#0C588A', '#41B6F3']} style={styles.linearGradient}>
         <ActivityIndicator color="#fff" style={{marginRight: 5}} />
        <Text style={styles.buttonText}>
           {props.buttonText}
        </Text>
    </LinearGradient>:
    <TouchableOpacity activeOpacity={.5} style={styles.holder} onPress={props.onPress}>
    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#0C588A', '#41B6F3']} style={styles.linearGradient} >
        <Text style={styles.buttonText}>
        {props.buttonText}
        </Text>
    </LinearGradient>
    </TouchableOpacity>
  )
    
   
}

var styles = StyleSheet.create({
    holder:{
      width:"100%",
    },
    linearGradient: {
      width:"100%",
      height:hp("8%"),
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5,
      alignItems:"center",
      justifyContent:"center"
    },
    buttonText: {
      fontSize: 18,
      textAlign: 'center',
      margin: 10,
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
  });
export default Button
