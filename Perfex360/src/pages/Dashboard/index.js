import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image} from "react-native";
import Container from "../../components/Container"
import { Theme,wp,fontsize, hp,Bg } from '../../lib/constants';

const Dashboard = props => {
  
  return (
    <Container title={"Perfex360"} >
      <View style={styles.container}>
        <View style={styles.panel}>
          <TouchableOpacity style={styles.panelbox} onPress={()=>{props.navigation.navigate("CreateObservation")}}>
            <View style={styles.imgholder}><Image style={styles.icon} source={require("../../assets/icons/Create.png")}></Image></View>
            <View style={styles.icontxtcontainer}><Text style={styles.icontxt}>Create Observation</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelbox} onPress={()=>{props.navigation.navigate("Observation")}}>
          <View style={styles.imgholder}><Image style={styles.icon} source={require("../../assets/icons/View.png")}></Image></View>
            <View style={styles.icontxtcontainer}><Text style={styles.icontxt}>View Observation</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelbox} activeOpacity={1}>
          <View style={styles.imgholder}><Image style={styles.icon} source={require("../../assets/icons/Pending.png")}></Image></View>
            <View style={styles.icontxtcontainer}><Text style={styles.icontxt}>View Pending Actions</Text></View>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  )
};
const styles = StyleSheet.create({
  container:{
    flex:1,justifyContent:"flex-start",backgroundColor:Bg
  },
  imgholder:{
    width:wp("15%"),
  },
  icon:{
    resizeMode:"contain",
    height:wp("15%"),
  },
  icontxtcontainer:{
    justifyContent:"center",
    alignItems:"center"
  },
  icontxt:{
    fontSize:fontsize(2.5),
    marginLeft:20,
    color:"#9F9F9F"
  },
  panel:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    marginTop:hp("5%")
  },
  panelbox:{
    width: wp('80%'),
    height: hp("13%"),
    backgroundColor:"#fff",
    borderRadius:5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center",
    marginVertical:hp("3%"),
    paddingHorizontal:wp("6%"),
    paddingVertical:hp("3%")
  }
})
export default Dashboard;
