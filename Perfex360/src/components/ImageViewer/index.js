import React,{useState,} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView} from "react-native";
import { Theme,wp,hp,fontsize,Bg } from '../../lib/constants';


const ImageViewer = props => {

    const [showscreen, setshowscreen] = useState(true);
    const [imgloader, setimgloader] = useState(false);


    if(showscreen){
        console.log("props.Url",props.Url)
        return(
            <View style={styles.overlayer}>
                <View style={styles.closecontainer}>
                <TouchableOpacity onPress={props.close}>
                    <Image style={styles.closeimages} source={require("../../assets/icons/exit.png")} onLoad={() => setimgloader(false)}></Image>
                </TouchableOpacity>
                </View>
                <View style={styles.imagecontainer}>
                  <Image style={styles.images} source={imgloader  ? require("../../assets/icons/imgloader.png") : {uri:props.Url}} onLoad={() => setimgloader(false)}></Image>
                </View>
                
            </View>
        )
    }else{
        return( null )
    }

    
}

const styles = StyleSheet.create({
    overlayer:{
        width:wp("100%"),
        height:'100%',
        position:'absolute',
        backgroundColor:"rgba(89, 89, 89, 0.8)",
        display:'flex',
        //justifyContent:'center',
        alignItems:'center',
    },
    imagecontainer:{
       //width:wp("90%"),
        display:'flex',
        justifyContent:'flex-start',
        alignItems:'flex-start',
    },
    images:{
        resizeMode:'contain',
        width:wp("90%"),
        height:wp("100%"),
        zIndex:1
    },
    closecontainer:{
        width:"100%",
        display:'flex',
        alignItems:'flex-end',
        paddingTop:hp("10%"),
        paddingRight:20,
        paddingBottom:10
    },
    closeimages:{
        width:30,
        height:30,
        backgroundColor:"white",
        borderRadius:15,
        padding:5
    }
})
export default ImageViewer;