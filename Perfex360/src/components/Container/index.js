import React from 'react'
import { View, StatusBar, Keyboard, StyleSheet, Text, Dimensions ,KeyboardAvoidingView,Platform, ScrollView, Image, TouchableOpacity} from 'react-native'
const windowHeight = Dimensions.get('window').height;
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SafeAreaView } from 'react-navigation';
import {  Theme , wp,hp, fontsize,Bg} from '../../lib/constants';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../redux/actions/auth.actions'
import { connect } from 'react-redux'

const Container = ({ children, styles, title, logout}) => {
  const navigation = useNavigation();
    return (
        <SafeAreaView style={{flex:1,backgroundColor:Theme}}>
        <View style={[css.container, styles, { marginTop: 0, backgroundColor: Bg }]}
            onPress={Keyboard.dismiss}>
            <StatusBar barStyle={"dark-content"}
                backgroundColor={Theme}
                translucent={false}>
            </StatusBar>
            {title ?<View style={css.backgroundhome}>
                <Text style={css.titlehome}>{title}</Text>
                <TouchableOpacity style={css.imgholder} onPress={()=>{logout()}}><Text style={css.icontxt}>Logout</Text><Image style={css.icon} source={require("../../assets/icons/Logout.png")}></Image></TouchableOpacity>
            </View>:null}
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{flex:1}}>
             <ScrollView>
            {children}
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
        </SafeAreaView>
    )
}

const css = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Bg,
        marginTop: 0,
        height:windowHeight-getStatusBarHeight()
    },
    backgroundhome:{
        backgroundColor:Theme,
        height: hp("8%"),
        width: wp('100%'),
        justifyContent:"space-between",
        flexDirection:"row",
        alignItems:"center",
        position:"relative",
        borderBottomColor:"#ffffff",
        borderBottomWidth:0.3,
        paddingHorizontal:wp("10")
      },
      imgholder:{
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "row"
      },
      icontxt:{
        fontSize:fontsize(2),
        color:"#ffffff",
        paddingRight:5
      },
      icon:{

      },
    background:{
        backgroundColor:Theme,
        height: hp("8%"),
        width: wp('100%'),
        justifyContent:"center",
        alignItems:"center",
        position:"relative",
        borderBottomColor:"#ffffff",
        borderBottomWidth:0.3
      },
      title:{
        fontSize:fontsize(2.5),
        color:"#ffffff",
      },
      titlehome:{
        fontSize:fontsize(3),
        color:"#ffffff",
        fontWeight:"bold"
      },
})

export default connect(null, { logout })(Container)
