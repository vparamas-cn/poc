import React, { useState, useEffect,Fragment } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Alert , Platform, Picker} from "react-native";
import Container from "../../components/Container"
import { Theme, wp, hp, fontsize, Bg } from '../../lib/constants';
import DateTimePicker from '@react-native-community/datetimepicker'
import Button from "../../components/Button"
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from "react-native-image-picker";
import moment from 'moment'
import axios from 'axios'
import Joi from 'react-native-joi'
import { connect } from 'react-redux'
import { fetcharea, fetchsection } from '../../redux/actions/observation.actions'
import { api } from '../../lib/constants';
import Spinner from 'react-native-loading-spinner-overlay';
var FormData = require('form-data');
import ImageViewer from '../../components/ImageViewer';


const options = {
  title: "Select Image",
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

const CreateObservation = props => {
  const dataval = props.route.params;
  const [imgviewerurl, setimgviewerurl] = useState(undefined);
  const [add, setaddd] = useState(0);
  const [spinner, setspinner] = useState(false)
  const [observation_id, setObservation] = useState(undefined);
  const [imgloader, setimgloader] = useState(false);

  const [data, setData] = useState({
    employee_name: props.user.user_name,
    observation_date: new Date(),
    section_id: undefined,
    area_id: undefined,
    observation: undefined,
    remarks: undefined,
    user_id: props.user.user_id,
    observation_id: undefined
  })
  const [dataimage, setDataImg] = useState({
    image1: undefined,
    description1: undefined,
    id1:undefined,
    image2: undefined,
    description2: undefined,
    id2:undefined,
    image3: undefined,
    description3: undefined,
    id3:undefined,
    user_id: props.user.user_id
  })

  const schema = Joi.object({
    employee_name: Joi.string().required(),
    observation_date: Joi.date().required(),
    section_id: Joi.number().required(),
    area_id: Joi.number().required(),
    observation: Joi.string().required(),
    remarks: Joi.string().required(),
    user_id: Joi.number().required(),
    observation_id: Joi.number().required()
  })
  useEffect(() => {
    props.fetcharea();
    props.fetchsection();
  }, [])
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      props.fetcharea();
      props.fetchsection();
    });
    return unsubscribe;
  }, [props.navigation]);
  useEffect(() => {
    if (dataval !== undefined) {
      setData({
        employee_name: dataval[0].employee_name,
        observation_date: new Date(dataval[0].observation_date),
        section_id: dataval[0].section_id,
        area_id: dataval[0].area_id,
        observation: dataval[0].observation,
        remarks: dataval[0].remarks,
        user_id: props.user.user_id,
        observation_id:dataval[0].observation_id
      })

      setDataImg({
        image1: dataval[0].photo_url !== null ? {uri:"http://52.66.249.22:3000/"+dataval[0].photo_url} : undefined,
        description1: dataval[0].description !== null ? dataval[0].description : undefined,
        image2: dataval[1] && dataval[1].photo_url !== null ? {uri:"http://52.66.249.22:3000/"+dataval[1].photo_url} : undefined,
        description2: dataval[1] && dataval[1].description !== null ? dataval[1].description : undefined,
        image3: dataval[2] && dataval[2].photo_url !== null ? {uri:"http://52.66.249.22:3000/"+dataval[2].photo_url }: undefined,
        description3: dataval[2] && dataval[2].description !== null ? dataval[2].description : undefined,
        user_id: props.user.user_id
      })
      setObservation(dataval[0].observation_id)
    }
  }, [dataval])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const imagePicker = (type) => {
   
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);
   

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };
        if (type == "image1"){
          setimgloader("img1");
          setDataImg({
            ...dataimage, image1: {
              name: response.fileName,
              type: response.type,
              uri:
                Platform.OS === "android" ? response.uri : response.uri.replace("file://", "")
              },
              id1:dataval[0].observation_file_id
          })
        }
        else if (type == "image2"){
          setimgloader("img2");
          setDataImg({
            ...dataimage, image2: {
              name: response.fileName,
              type: response.type,
              uri:
                Platform.OS === "android" ? response.uri : response.uri.replace("file://", "")
              },
              id2:dataval[1] ? dataval[1].observation_file_id:undefined
            })
          }
          else if (type == "image3"){
            setimgloader("img3");
            setDataImg({
              ...dataimage, image3: {
                name: response.fileName,
                type: response.type,
                uri:
                  Platform.OS === "android" ? response.uri : response.uri.replace("file://", "")
                },
                id3:dataval[2] ? dataval[2].observation_file_id:undefined
            })
          }
      }
    });
  };
  const uploadimage = async (image, description, o_id,o_f_id) => {
    const formData = new FormData()
    image.name = image.uri.substring(image.uri.lastIndexOf('/') + 1);
    formData.append('file', image)
    formData.append('user_id', props.user.user_id)
    formData.append('observation_id', o_id)
    if(o_f_id)
    formData.append('observation_file_id', o_f_id)
    formData.append('description', description)
    var config = { method: 'post', url: api.fileupload, headers: { 'x-access-token': props.user.token, 'Content-Type': 'multipart/form-data'},data : formData};
    let response = await axios(config)
    return response;

  }
  const deletefile = async(o_f_id)=>{
    const formData = new FormData();
    formData.append('observation_file_id', o_f_id)
    var config = { method: 'post', url: api.filedelete, headers: { 'x-access-token': props.user.token},data : formData};
    let response = await axios(config)
    return response;
  }
  const checkimgdescription = () => {
    let showalert = false;

    if(dataimage.image1 == undefined || dataimage.description1 == undefined || dataimage.description1 == ''){
      showalert = true;
    }
    if((dataimage.image2 != undefined && (dataimage.description2 == undefined || dataimage.description2 == "")) || (dataimage.image2 == undefined && (dataimage.description2 != undefined && dataimage.description2 != "")) ){
      showalert = true;
    }
    if((dataimage.image3 != undefined && (dataimage.description3 == undefined || dataimage.description3 == "")) || (dataimage.image3 == undefined && (dataimage.description3 != undefined && dataimage.description3 != ""))){
      showalert = true;
    }
    return showalert;
  }
  const submit = () => {


    Joi.validate(data, schema, (err, value) => {
      if (err) return Alert.alert(err.message)
      let showalert = checkimgdescription();
      if (showalert) return Alert.alert("Description and Image Required");
      setspinner(true)
      value.observation_date = moment(value.observation_date).format("YYYY-MM-DD hh:mm:ss")
      var config = { method: 'post', url: api.createobservation, headers: { 'x-access-token': props.user.token, 'Content-Type': 'application/json'},data : value};
      axios(config)
        .then(async (res) => {
          let resultdata = res;
          if(resultdata.data.status === 200){
            try{
              if(dataimage.image1 && dataimage.image1.type){
                let res= await uploadimage(dataimage.image1, dataimage.description1,data.observation_id,dataimage.id1);
              }
              else{
               
                  if(dataval[0].photo_url !== null && !dataimage.image1){
                    let deleteres = deletefile(dataval[0].observation_file_id)
                  }
              }
              if(dataimage.image2 && dataimage.image2.type){
                let res= await uploadimage(dataimage.image2, dataimage.description2,data.observation_id,dataimage.id2);
              }
              else{
                  if(dataval[1] && dataval[1].photo_url !== null && !dataimage.image2){
                    let deleteres = deletefile(dataval[1].observation_file_id)
                  }
              }
              if(dataimage.image3 && dataimage.image3.type){
                let res= await uploadimage(dataimage.image3, dataimage.description3,data.observation_id,dataimage.id3);
              }
              else{
                  if(dataval[2] && dataval[2].photo_url !== null && !dataimage.image3){
                    let deleteres = deletefile(dataval[2].observation_file_id)
                  }
              }
              setspinner(false)
              Alert.alert(
                'Info',
                'Successfully Updated!!!',
                [
                  { text: 'OK', onPress: () => props.navigation.navigate("Observation") }
                ],
                { cancelable: false }
              );
            }
            catch(er){
              setspinner(false)
            }
          }
          else {
            Alert.alert("Failed")
            setspinner(false)
          }
        }).catch(err => {
          setspinner(false)
          Alert.alert(err.message)})
    })
  }
  const DateChange = (e,date) => {
    setShowDatePicker(false) 
     console.log(moment(date).format('ll'))
     setData({ ...data, observation_date: date })
  }
  const ProgressImage = () => {
    console.log("ProgressImage")
  }
  return (
    <Fragment>
    <Container title={"Edit Observation" }>
      <View style={styles.container}>
        <View style={styles.btncontainer}>
          <TouchableOpacity style={styles.back} onPress={() => { props.navigation.navigate("Observation") }}>
            <Image style={styles.icon} source={require("../../assets/icons/backnav.png")} />
            <Text style={styles.backtxt}>Back to list</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.panel}>
          <View style={styles.panelbox}>
            <View style={styles.sectionbox}>
              <Text style={styles.sectiontitle}>Employee Name</Text>
              <TextInput style={styles.input}
                editable={false}
                underlineColorAndroid="transparent"
                placeholder="Employee Name"
                placeholderTextColor={Theme}
                autoCapitalize="none"
                value={data.employee_name}
                onChangeText={val => setData({ ...data, employee_name: val })} />
            </View>
            {Platform.OS === 'ios' ? 
                    <View style={styles.sectionbox}>
                        <Text style={styles.sectiontitle}>Observation Date</Text>
                          <View style={{position:"relative"}}>
                          <DateTimePicker
                          style={styles.input}
                                value={data.observation_date}
                                mode='date'
                                display='default'
                                textColor={Theme}
                                onChange={(e, date) => {
                                    setShowDatePicker(false)
                                    date && setData({ ...data, observation_date: date })
                                  
                                }}
                            />
                            <Image style={styles.inputbtn} source={require("../../assets/icons/calendar.png")} />
                            </View>
                    </View>
                  :
                    <View style={styles.sectionbox}>
                        <Text style={styles.sectiontitle}>Observation Date</Text>
                          <View style={{position:"relative",}}>
                            <TouchableOpacity onPress={()=>{setShowDatePicker(true)}}>
                              <TextInput style={styles.datepickerinput}
                                editable={false}
                                underlineColorAndroid="transparent"
                                placeholder="Date"
                                placeholderTextColor={Theme}
                                autoCapitalize="none"
                                value={moment(data.observation_date).format('ll')}
                                />
                            </TouchableOpacity>
                            {showDatePicker && <DateTimePicker
                              style={styles.input}
                                    value={data.observation_date}
                                    mode='date'
                                    display='default'
                                    textColor={Theme}
                                    onChange={(e, date) => {
                                      DateChange(e,date)
                                    }}
                                /> 
                              }
                              <Image style={styles.inputbtn} source={require("../../assets/icons/calendar.png")} />
                            </View>
                    </View>
                }
               
            {props.observation && props.observation.sectionlist.length > 0 ? <View style={styles.sectionbox}>
              <Text style={styles.sectiontitle}>Section</Text>
              <View style={styles.input}>
                <RNPickerSelect
                  onValueChange={(value) => setData({ ...data, section_id: value })}
                  items={
                    props.observation.sectionlist.map((e, i) => { return { label: e.section_name, value: e.section_id } })}
                  value={data.section_id}
                />
                <Image style={styles.inputbtn} source={require("../../assets/icons/dropdown.png")} />
              </View>
            </View> : null}
            {props.observation && props.observation.arealist.length > 0 ? <View style={styles.sectionbox}>
              <Text style={styles.sectiontitle}>Area</Text>
              <View style={styles.input}>
                <RNPickerSelect
                  onValueChange={(value) => setData({ ...data, area_id: value })}
                  items={
                    props.observation.arealist.map((e, i) => { return { label: e.area_name, value: e.area_id } })}
                  value={data.area_id}
                />
                <Image style={styles.inputbtn} source={require("../../assets/icons/dropdown.png")} />
              </View>
            </View> : null}
            <View style={styles.sectionbox}>
              <Text style={styles.sectiontitle}>Observation</Text>
              <TextInput style={Platform.OS === 'ios' ? styles.textarea : styles.textareaandroid}
                underlineColorAndroid="transparent"
                placeholder="Observation"
                placeholderTextColor={Theme}
                autoCapitalize="none"
                value={data.observation}
                numberOfLines={10}
                multiline={true}
                onChangeText={val => setData({ ...data, observation: val })} />
            </View>
            <View style={styles.sectionbox}>
              <Text style={styles.sectiontitle}>Remarks</Text>
              <TextInput style={Platform.OS === 'ios' ? styles.textarea : styles.textareaandroid}
                underlineColorAndroid="transparent"
                placeholder="Remarks"
                placeholderTextColor={Theme}
                autoCapitalize="none"
                value={data.remarks}
                numberOfLines={10}
                multiline={true}
                onChangeText={val => setData({ ...data, remarks: val })} />
            </View>
            <View style={styles.sectionbox}>
              <Text style={styles.sectiontitle}>Image</Text>
              {!dataimage.image1 ? <TouchableOpacity style={styles.addimage} onPress={() => { imagePicker("image1") }}>
                <Text>Click to</Text><Text>add image</Text>
              </TouchableOpacity> :
                <View style={styles.imageholder}><View style={styles.imagecontainer}>
                  <TouchableOpacity  onPress={()=>{setimgviewerurl(dataimage.image1.uri)}}><Image style={imgloader == "img1" ?styles.imagesloader:styles.images} source={imgloader == "img1" ? require("../../assets/icons/imgloader.png") : {uri:dataimage.image1.uri}} onLoad={() => setimgloader(false)}></Image></TouchableOpacity></View><TouchableOpacity style={styles.remove} onPress={() => { setDataImg({ ...dataimage, image1: undefined }) }}><Text style={styles.removetxt}>Remove</Text></TouchableOpacity></View>}
              <Text style={styles.sectiontitle}>Description</Text>
              <TextInput style={Platform.OS === 'ios' ? styles.textarea : styles.textareaandroid}
                underlineColorAndroid="transparent"
                placeholder="Description"
                placeholderTextColor={Theme}
                autoCapitalize="none"
                value={dataimage.description1}
                numberOfLines={10}
                multiline={true}
                onChangeText={val => setDataImg({ ...dataimage, description1: val })} />
            </View>
            <View style={styles.sectionbox}>
              <Text style={styles.sectiontitle}>Image</Text>
              {!dataimage.image2 ? <TouchableOpacity style={styles.addimage} onPress={() => { imagePicker("image2") }}>
                <Text>Click to</Text><Text>add image</Text>
              </TouchableOpacity> :
                <View style={styles.imageholder}><View style={styles.imagecontainer}>
                  <TouchableOpacity  onPress={()=>{setimgviewerurl(dataimage.image2.uri)}}><Image style={imgloader == "img2" ?styles.imagesloader:styles.images} source={imgloader == "img2" ? require("../../assets/icons/imgloader.png") : {uri:dataimage.image2.uri}} onLoad={() => setimgloader(false)}></Image></TouchableOpacity></View><TouchableOpacity style={styles.remove} onPress={() => { setDataImg({ ...dataimage, image2: undefined }) }}><Text style={styles.removetxt}>Remove</Text></TouchableOpacity></View>}
              <Text style={styles.sectiontitle}>Description</Text>
              <TextInput style={Platform.OS === 'ios' ? styles.textarea : styles.textareaandroid}
                underlineColorAndroid="transparent"
                placeholder="Description"
                placeholderTextColor={Theme}
                autoCapitalize="none"
                value={dataimage.description2}
                numberOfLines={10}
                multiline={true}
                onChangeText={val => setDataImg({ ...dataimage, description2: val })} />
            </View>
            <View style={styles.sectionbox}>
              <Text style={styles.sectiontitle}>Image</Text>
              {!dataimage.image3 ? <TouchableOpacity style={styles.addimage} onPress={() => { imagePicker("image3") }}>
                <Text>Click to</Text><Text>add image</Text>
              </TouchableOpacity> :
                <View style={styles.imageholder}><View style={styles.imagecontainer}>
                  <TouchableOpacity  onPress={()=>{setimgviewerurl(dataimage.image3.uri)}}><Image style={imgloader == "img3" ?styles.imagesloader:styles.images} source={imgloader == "img3" ? require("../../assets/icons/imgloader.png") : {uri:dataimage.image3.uri}} onLoad={() => setimgloader(false)}></Image></TouchableOpacity></View><TouchableOpacity style={styles.remove} onPress={() => { setDataImg({ ...dataimage, image3: undefined }) }}><Text style={styles.removetxt}>Remove</Text></TouchableOpacity></View>}
              <Text style={styles.sectiontitle}>Description</Text>
              <TextInput style={Platform.OS === 'ios' ? styles.textarea : styles.textareaandroid}
                underlineColorAndroid="transparent"
                placeholder="Description"
                placeholderTextColor={Theme}
                autoCapitalize="none"
                value={dataimage.description3}
                numberOfLines={10}
                multiline={true}
                onChangeText={val => setDataImg({ ...dataimage, description3: val })} />
            </View>
            
           

          </View>

          <View style={styles.button}>
            <Button onPress={() => submit(observation_id)} buttonText={"Update"} loading={false} />
          </View>

        </View>
        <Spinner
          visible={spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
      
    </Container>
    {imgviewerurl && <ImageViewer Url={imgviewerurl} close={() =>setimgviewerurl(undefined) }/>}
    </Fragment>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "flex-start", backgroundColor: Bg
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  backtxt: {
    fontSize: fontsize(2.5),
    color: "#0C588A"
  },
  btncontainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: wp("2.5%"),
  },
  back: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: hp("1%")
  },
  background: {
    backgroundColor: Theme,
    height: hp('12%'),
    width: wp('100%'),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  inputbtn: {
    position: "absolute",
    top: hp("2.7%"),
    right: 17
  },
  imageholder: {
    flexDirection: "row"
  },
  remove: {
    height: wp("25%"),
    justifyContent: "flex-end",
    paddingLeft: wp("1%")
  },
  removetxt: {
    color: "red",
    fontSize: 13
  },
  imagecontainer: {
    width: wp("25%"),
    height: wp("25%"),
    borderColor: "#cccccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: hp("1%")
  },
  images: {
    resizeMode: "contain",
    width: wp("25%"),
    height: wp("25%"),
  },
  title: {
    fontSize: fontsize(2.5),
    color: "#ffffff",
  },
  textarea: {
    width: "100%",
    marginBottom: hp('3%'),
    height: hp("10%"),
    borderColor: Theme,
    borderWidth: 1,
    borderRadius: hp("1%"),
    paddingLeft: wp("3%"),
    fontSize: fontsize(1.9),
    color: "#000000",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  addcontainer: {
    paddingHorizontal: wp("5%")
  },
  addbtn: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  addtxt: {
    fontSize: fontsize(2.5),
    color: "#424242"
  },
  input: {
    width: "100%",
    marginBottom: hp('3%'),
    height: hp("7%"),
    borderColor: Theme,
    borderWidth: 1,
    borderRadius: hp("1%"),
    paddingLeft: wp("3%"),
    fontSize: fontsize(1.9),
    color: "#000000",
    justifyContent: "center",
    backgroundColor: "#fff",
    position: "relative"
  },
  datepickerinput:{
    width:"100%",
    marginBottom:hp('3%'),
    height: hp("7%"),
    borderColor: Theme,
    borderWidth: 1,
    borderRadius:hp("1%"),
    paddingLeft: wp("3%"),
    fontSize: fontsize(1.9),
    color:"#000000",
    justifyContent:"center",
    backgroundColor:"#fff",
    position: "relative"
  },
  panel: {
    backgroundColor: Bg,
    paddingBottom: hp("2.5%"),
  },
  textareaandroid: {
    width: "100%",
    marginBottom: hp('3%'),
    height: hp("10%"),
    borderColor: Theme,
    borderWidth: 1,
    borderRadius: hp("1%"),
    paddingLeft: wp("3%"),
    fontSize: fontsize(1.9),
    color: "#000000",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    textAlignVertical: "top",
  },
  panelbox: {
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
    marginVertical: hp("1.2%"),
    marginHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
  },
  sectionbox: {
    flex: 1,
    marginHorizontal: wp("5%"),
    marginVertical: hp("1%"),
  },
  addimage: {
    width: hp("15%"),
    height: hp("15%"),
    borderColor: "#cccccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: hp("1%")
  },
  sectiontitle: {
    fontSize: fontsize(1.8),
    fontWeight: "bold",
    paddingBottom: hp("1.5%"),
    color: Theme
  },
  sectiondescription: {
    fontSize: fontsize(1.8),
    fontWeight: "bold",
    paddingVertical: hp("1.5%"),
    color: Theme
  },
  detail: {
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("2%"),
    backgroundColor: "#3f4a9660",
    borderRadius: hp("3%"),
    justifyContent: "center",
    alignItems: "flex-start"

  },
  detailtxt: {
    fontSize: fontsize(2),
    color: "#000000"
  },
  date: {
    fontSize: fontsize(1.7),
    fontWeight: "bold",
    color: "#ffffff",
    padding: hp("0.5%")
  },
  button: {
    marginHorizontal: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom:50,
  },
  datetxt: {
    fontSize: fontsize(1.9),
    color: Theme,
  }
  ,
})

const mstp = state => ({ user: state.user, observation: state.observation })
export default connect(mstp, { fetcharea, fetchsection })(CreateObservation)
