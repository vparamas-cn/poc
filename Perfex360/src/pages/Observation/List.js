import React,{useEffect, useState} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList} from "react-native";
import Container from "../../components/Container"
import { Theme,hp,wp, fontsize, Bg } from '../../lib/constants';
import { connect } from 'react-redux'
import moment from 'moment'
import { groupby } from "../../utils"
import { fetchlist, fetchsection, fetcharea  } from '../../redux/actions/observation.actions'

const Observation = props => {
  const { navigation, observation } = props
  const [listdata, setData] = useState([]);
  const {list} = observation;
  useEffect(()=>{
    props.fetcharea();
    props.fetchsection();
    props.fetchlist();
  },[])
  useEffect(()=>{
    if(list && list.length > 0){
      let result = groupby(list,"observation_id");
      result = Object.values(result);
      setData(result);
    }
  },[list])
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      props.fetchlist();
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <Container title={"Observation List"}>
      <View style={styles.container}>
        <FlatList
            style={styles.list}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            data={listdata}
            renderItem={({ item }) =>
                (
                    <TouchableOpacity style={styles.panelbox} >
                        <View style={styles.details}>
                            <Text style={styles.sectiontitle}>Employee</Text>
                            <Text style={styles.detailsname}>{item[0].employee_name}</Text>
                            <Text style={styles.sectiontitle}>Observation</Text>
                            <Text style={styles.detailsobs} numberOfLines={10}>{item[0].observation}</Text>
                        </View>
                        <View style={styles.detaildate}>
                             <Text style={styles.sectiontitle}>Date</Text>
                              <View style={styles.datealign}><Image style={styles.calendar} source={require("../../assets/icons/calendar.png")}></Image><Text style={styles.date}>{moment(item[0].observation_date).format("DD MMM YYYY")}</Text></View>
                              <TouchableOpacity style={styles.view} onPress={()=>{props.navigation.navigate("ViewObservation",item)}}><Text style={styles.viewtxt}>View</Text></TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )
            }
        />
    
      </View>
    </Container>
  )
};
const styles = StyleSheet.create({
  container:{
    flex:1,justifyContent:"flex-start",backgroundColor:Bg
  },
  icon:{
    width:wp("15%"),
    height:wp("15%"),
  },
  datealign:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center"
  },
  list:{
    flex:1,
    marginTop:hp("1%"),
    padding:20
  },
  view:{
    width:wp("20%"),
    height:hp("5%"),
    borderRadius:5,
    backgroundColor:"#41B6F3",
    justifyContent:"center",
    alignItems:"center",
    marginTop:25
  },
  viewtxt:{
      color:"#ffffff",
      fontWeight:"bold"
  },
  date:{
      fontSize:fontsize(2),
      color:"#474747",

  },
  panelbox:{
    width: "100%",
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
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:wp("5%"),
    paddingVertical:hp("2%"),
    marginVertical:hp("2%"),
  },
  sectiontitle:{
    fontSize:fontsize(1.8),
    paddingBottom:hp("1%"),
    color:Theme
  },
  details:{
      width:wp("52%"),
      padding:5,
      height:"100%"  
  },
  detailsobs:{
    maxHeight:hp("10%"),
    fontSize:fontsize(2),
    color:"#474747"
   
  },
  detailsname:{
    fontSize:fontsize(3.5),
    fontWeight:"bold",
    color:"#474747",
    marginBottom:10
  },
  detaildate:{
    width:wp("30%"),
    alignItems:"flex-end",
    justifyContent:"flex-start",
    height:"100%",
    padding:5
  },
  calendar:{
    marginRight:5,
  }
})

const mstp = state => ({ observation: state.observation })
export default connect(mstp, { fetchlist, fetchsection, fetcharea  })(Observation)
