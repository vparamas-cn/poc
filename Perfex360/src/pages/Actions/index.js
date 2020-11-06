import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Container from "../../components/Container"
import { Bg,hp } from '../../lib/constants';

const Action = (props) => {
    
  return(
   <Container title={"Pending Actions"}>
       <View style={styles.container}>
           <Text style={styles.txt}>Under Construction</Text>
           <Text style={styles.txt}>Coming Soon!!!</Text>
       </View>
   </Container>
  )
    
   
}

var styles = StyleSheet.create({
    container:{
        justifyContent:"flex-start",backgroundColor:Bg,
        marginTop:hp("10%"),
        justifyContent:"center",alignItems:"center"
    },
    txt: {
      fontSize: 18,
      textAlign: 'center',
      margin: 10,
      color: '#424242',
      fontWeight: 'bold',
    },
  });
export default Action
