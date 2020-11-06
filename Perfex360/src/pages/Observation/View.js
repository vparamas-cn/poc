import React, { useCallback } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView} from "react-native";
import Container from "../../components/Container"
import { Theme,wp,hp,fontsize,Bg } from '../../lib/constants';
import Button from "../../components/Button"
import { useSelector } from 'react-redux'


const ViewObservation = props => {
  const observation = useSelector(state => state.observation);

  const data = props.route.params;
  const edit =()=>{

  }
  const mapdatawithid = (id,type) => {
    let res = "";
    if(type === "area")
    {
        res = observation.arealist && observation.arealist.filter((rec)=>{ return rec.area_id === id});
        if(res.length > 0)
        {
         res = res[0].area_name
        }
        else{
          res = "";
        }
    }
    else if(type === "section")
    {
       res = observation.sectionlist && observation.sectionlist.filter((rec)=>{return rec.section_id === id});
       console.log(res)
       if(res.length > 0)
       {
        res = res[0].section_name
       }
       else{
        res = "";
      }
    }
    return res;
  };
  
  return (
    <Container title={"Observation Detail"}>
      <View style={styles.container}>
        <View style={styles.background}>
            <View style={styles.section}>
              <View style={styles.datealign}><Image style={styles.calendar} source={require("../../assets/icons/calendar.png")}></Image><Text style={styles.date}>02 OCT 2020</Text></View>
              <Text style={styles.detailsname}>{data[0].employee_name}</Text>
            </View>
            <View style={styles.sectiondetails}>
              <View style={styles.inline}>
                  <Text style={styles.title}>Section - </Text>
                  <Text style={styles.content}>{observation && mapdatawithid(data[0].section_id,"section")}</Text>
              </View>
              <View style={styles.inline}>
                  <Text style={styles.title}>Area - </Text>
                  <Text style={styles.content}>{observation && mapdatawithid(data[0].area_id,"area")}</Text>
              </View>
              <View style={styles.block}>
                  <Text style={styles.title}>Observation</Text>
                  <Text style={styles.details}>{data[0].observation}</Text>
              </View>
              <View style={styles.block}>
                  <Text style={styles.title}>Remarks</Text>
                  <Text style={styles.details}>{data[0].remarks}</Text>
              </View>
            </View>
            {data.map((rec,i)=>{
              return(
                <View style={styles.imageblock} key={i}>
                  <Image style={styles.images} source={{uri:`http://localhost:3080/${rec.photo_url}`}}></Image>
                  <Text style={styles.details}>{rec.description}</Text>
              </View>
              )
            })}
            
           
            <View style={styles.btncontainer}>
              <TouchableOpacity style={styles.back} onPress={()=>{props.navigation.navigate("Observation")}}>
                <Image style={styles.icon} source={require("../../assets/icons/backnav.png")}/>
                <Text style={styles.backtxt}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.view} onPress={()=>{props.navigation.navigate("EditObservation",data)}}>
                <Image style={styles.editicon} source={require("../../assets/icons/editicon.png")}/>
                <Text style={styles.viewtxt}>Edit</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </Container>
  )
};
const styles = StyleSheet.create({
  container:{
    flex:1,justifyContent:"flex-start",backgroundColor:Bg
  },
  icon:{
    width:wp("7%"),
    height:wp("7%")
  },
  editicon:{
    width:wp("5%"),
    height:wp("5%"),
    marginRight:5
  },
  backtxt:{
    fontSize:fontsize(2.5),
    color:"#0C588A"
  },
  btncontainer:{
    flex:1,
    justifyContent:"space-between",
    alignItems:"center",
    flexDirection:"row"
  },
  back:{
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center",
    paddingVertical:hp("1%")
  },
  view:{
    width:wp("25%"),
    height:hp("5%"),
    borderRadius:5,
    backgroundColor:"#41B6F3",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  },
  viewtxt:{
      color:"#ffffff",
      fontSize:fontsize(2.5),
      fontWeight:"bold"
  },
  section:{
    justifyContent:"flex-start",
    alignItems:"flex-start",
    borderBottomWidth:1,
    borderBottomColor:"#0C588A"
  },
  sectiondetails:{
    paddingVertical:hp("2%")
  },
  inline:{
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center",
    paddingVertical:hp("1%")
  },
  block:{
    paddingVertical:hp("1%")
  },
  imageblock:{
    width:wp("86%"),
    marginVertical:hp("2%")
  },
  calendar:{
    marginRight:5,
  },
  details:{
    paddingTop:hp("2%")
  },
  detailsname:{
    fontSize:fontsize(6),
    fontWeight:"bold",
    color:"#474747",
    marginBottom:10
  },
  datealign:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center"
  },
  date:{
    fontSize:fontsize(2.2),
    color:"#474747",

},
  background:{
    width:wp("86%"),
    margin:wp("7%")
  },
  images:{
    width:wp("86%"),
    height:wp("50%"),
    resizeMode:"contain",
    borderWidth:1,
    borderStyle:"dotted"
  },
  title:{
    fontSize:fontsize(2.5),
    color:"#0C588A",
  },
  content:{
    fontWeight:"bold"
  },
  
  
  button:{
      width:wp("100%"),
      justifyContent:"center",
      alignItems:"center",
      marginTop:10
  }
})
export default ViewObservation;
