import React, { useState, useEffect, useRef, Fragment } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, Alert, Platform } from "react-native";
import Container from "../../components/Container"
import { Theme, wp, hp, fontsize, Bg } from '../../lib/constants';
import DateTimePicker from '@react-native-community/datetimepicker'
import Button from "../../components/Button"
//import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-community/picker';
import ImagePicker from "react-native-image-picker";
import moment from 'moment'
import axios from 'axios'
import Joi from 'react-native-joi'
import { connect } from 'react-redux'
import { fetcharea, fetchsection } from '../../redux/actions/observation.actions'
import { api } from '../../lib/constants';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageViewer from '../../components/ImageViewer';
import NetInfo from "@react-native-community/netinfo";
import { setStorage } from "../../utils"
var FormData = require('form-data');


const options = {
  title: "Select Image",
  storageOptions: {
    skipBackup: true,
    path: "images",
    privateDirectory: true
  }
};

const CreateObservation = props => {
  const [add, setaddd] = useState(0);
  const [spinner, setspinner] = useState(false);
  const [imgloader, setimgloader] = useState(false);
  const [imgviewerurl, setimgviewerurl] = useState(undefined);
  const [data, setData] = useState({
    employee_name: props.user.user_name,
    observation_date: new Date(),
    section_id: "",
    area_id: "",
    observation: undefined,
    remarks: undefined,
    user_id: props.user.user_id
  })
  const [dataimage, setDataImg] = useState({
    images1: undefined,
    description1: undefined,
    images2: undefined,
    description2: undefined,
    images3: undefined,
    description3: undefined,
    user_id: props.user.user_id
  })

  const schema = Joi.object({
    employee_name: Joi.string().required().error(() => {
      return {
        message: 'Employee name is required.',
      };
    }),
    observation_date: Joi.date().required().error(() => {
      return {
        message: 'Observation Date is required.',
      };
    }),
    section_id: Joi.number().required().error(() => {
      return {
        message: 'Section is required.',
      };
    }),
    area_id: Joi.number().required().error(() => {
      return {
        message: 'Area is required.',
      };
    }),
    observation: Joi.string().required().error(() => {
      return {
        message: 'Observation is required.',
      };
    }),
    remarks: Joi.string().required().error(() => {
      return {
        message: 'Remarks is required.',
      };
    }),
    user_id: Joi.number()
  })
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        props.fetcharea();
        props.fetchsection();
      }
    });
  }, [])

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
        if (type == "image1") {
          setimgloader("img1");
          setDataImg({
            ...dataimage, image1: {
              name: response.fileName,
              type: response.type,
              uri:
                Platform.OS === "android" ? response.uri : response.uri.replace("file://", "")
            }
          })

        } else if (type == "image2") {
          setimgloader("img2");
          setDataImg({
            ...dataimage, image2: {
              name: response.fileName,
              type: response.type,
              uri:
                Platform.OS === "android" ? response.uri : response.uri.replace("file://", "")
            }
          })
        } else if (type == "image3") {
          setimgloader("img3");
          setDataImg({
            ...dataimage, image3: {
              name: response.fileName,
              type: response.type,
              uri:
                Platform.OS === "android" ? response.uri : response.uri.replace("file://", "")
            }
          })
        }
      }
    });
  };
  const uploadimage = async (image, description, o_id) => {
    const formData = new FormData()
    image.name = image.uri.substring(image.uri.lastIndexOf('/') + 1);
    formData.append('file', image)
    formData.append('user_id', props.user.user_id)
    formData.append('observation_id', o_id)
    formData.append('description', description)
    var config = { method: 'post', url: api.fileupload, headers: { 'x-access-token': props.user.token, 'Content-Type': 'multipart/form-data' }, data: formData };
    let response = await axios(config)
    return response;

  }

  const checkimgdescription = () => {
    let showalert = false;

    if (dataimage.image1 == undefined || dataimage.description1 == undefined || dataimage.description1 == '') {
      showalert = true;
    }
    if ((dataimage.image2 != undefined && (dataimage.description2 == undefined || dataimage.description2 == "")) || (dataimage.image2 == undefined && (dataimage.description2 != undefined && dataimage.description2 != ""))) {
      showalert = true;
    }
    if ((dataimage.image3 != undefined && (dataimage.description3 == undefined || dataimage.description3 == "")) || (dataimage.image3 == undefined && (dataimage.description3 != undefined && dataimage.description3 != ""))) {
      showalert = true;
    }
    return showalert;
  }
  const submit = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {

        Joi.validate(data, schema, (err, value) => {
          if (err) return Alert.alert(err.message)
          let showalert = checkimgdescription();
          if (showalert) return Alert.alert("Description and Image Required");
          setspinner(true)
          value.observation_date = moment(value.observation_date).format("YYYY-MM-DD hh:mm:ss")
          var config = { method: 'post', url: api.createobservation, headers: { 'x-access-token': props.user.token, 'Content-Type': 'application/json' }, data: value };
          axios(config)
            .then(async (res) => {
              let resultdata = res;
              if (resultdata.data.status === 200) {
                try {
                  if (dataimage.image1) {
                    let res = await uploadimage(dataimage.image1, dataimage.description1, resultdata.data.response);
                  }
                  if (dataimage.image2) {
                    let res = await uploadimage(dataimage.image2, dataimage.description2, resultdata.data.response);
                  }
                  if (dataimage.image3) {
                    let res = await uploadimage(dataimage.image3, dataimage.description3, resultdata.data.response);
                  }
                  setData({
                    employee_name: props.user.user_name,
                    observation_date: new Date(),
                    section_id: undefined,
                    area_id: undefined,
                    observation: undefined,
                    remarks: undefined,
                    user_id: props.user.user_id
                  })
                  setDataImg({
                    images1: undefined,
                    description1: undefined,
                    images2: undefined,
                    description2: undefined,
                    images3: undefined,
                    description3: undefined,
                    user_id: props.user.user_id
                  })
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
                catch (er) {
                  setspinner(false)
                }
              }
              else {
                Alert.alert("Failed")
                setspinner(false)
              }
            }).catch(err => {
              setspinner(false)
              Alert.alert(err.message)
            })
        })
      }
      else {
        let datajson= {...data,...dataimage}
        setStorage(datajson);
      }
    })
  }
  const DateChange = (e, date) => {
    setShowDatePicker(false)
    date && setData({ ...data, observation_date: date })
  }

  return (
    <Fragment>
      <Container title={"Create Observation"}>
        <View style={styles.container}>
          <View style={styles.panel}>
            <View style={styles.panelbox}>
              <View style={styles.sectionbox}>
                <Text style={styles.sectiontitle}>Employee Name</Text>
                <TextInput style={styles.input}
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
                  <View style={{ position: "relative" }}>
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
                  <View style={{ position: "relative", }}>
                    <TouchableOpacity onPress={() => { setShowDatePicker(true) }}>
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
                      minimumDate={new Date()}
                      display='default'
                      textColor={Theme}
                      onChange={(e, date) => {
                        DateChange(e, date)
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
                  {/* <RNPickerSelect
                    onValueChange={(value) => setData({ ...data, section_id: value })}
                    useNativeAndroidPickerStyle={false}
                    items={
                      props.observation.sectionlist.map((e, i) => { return { label: e.section_name, value: e.section_id } })}
                    value={data.section_id}
                  /> */}
                   <Picker
                    selectedValue={data.section_id}
                    onValueChange={val => setData({ ...data, section_id: val })}
                  >
                    <Picker.Item  value={""} label={"Select an item"} />
                    {props.observation.sectionlist.map(data => (
                      <Picker.Item key={data.section_id} value={data.section_id} label={data.section_name} />
                    ))}

                  </Picker>
                  <Image style={styles.inputbtn} source={require("../../assets/icons/dropdown.png")} />
                </View>
              </View> : null}
              {props.observation && props.observation.arealist.length > 0 ? <View style={styles.sectionbox}>
                <Text style={styles.sectiontitle}>Area</Text>
                <View style={styles.input}>
                  {/* <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    onValueChange={(value) => setData({ ...data, area_id: value })}
                    items={
                      props.observation.arealist.map((e, i) => { return { label: e.area_name, value: e.area_id } })}
                    value={data.area_id}
                  /> */}
                   <Picker
                    selectedValue={data.area_id}
                    onValueChange={val => setData({ ...data, area_id: val })}
                  >
                    <Picker.Item  value={""} label={"Select an item"} />
                    {props.observation.arealist.map(data => (
                      <Picker.Item key={data.area_id} value={data.section_id} label={data.area_name} />
                    ))}

                  </Picker>
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
                {!dataimage.image1 ?
                  <TouchableOpacity style={styles.addimage} onPress={() => { imagePicker("image1") }}>
                    <Text>Click to</Text><Text>add image</Text>
                  </TouchableOpacity>
                  :
                  <View style={styles.imageholder}>
                    <View style={styles.imagecontainer}>
                      <TouchableOpacity onPress={() => { setimgviewerurl(dataimage.image1.uri) }}>
                        <Image style={imgloader == "img1" ? styles.imagesloader : styles.images} source={imgloader == "img1" ? require("../../assets/icons/imgloader.png") : { uri: dataimage.image1.uri }} onLoad={() => setimgloader(false)}></Image>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.remove} onPress={() => { setDataImg({ ...dataimage, image1: undefined }) }}>
                      <Text style={styles.removetxt}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                }
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

              {add >= 1 ? <View style={styles.sectionbox}>
                <Text style={styles.sectiontitle}>Image</Text>
                {!dataimage.image2 ?
                  <TouchableOpacity style={styles.addimage} onPress={() => { imagePicker("image2") }}>
                    <Text>Click to</Text><Text>add image</Text>
                  </TouchableOpacity>
                  :
                  <View style={styles.imageholder}>
                    <View style={styles.imagecontainer}>
                      <TouchableOpacity onPress={() => { setimgviewerurl(dataimage.image2.uri) }}>
                        <Image style={imgloader == "img2" ? styles.imagesloader : styles.images} source={imgloader == "img2" ? require("../../assets/icons/imgloader.png") : { uri: dataimage.image2.uri }} onLoad={() => setimgloader(false)}></Image>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.remove} onPress={() => { setDataImg({ ...dataimage, image2: undefined }) }}>
                      <Text style={styles.removetxt}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                }
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
              </View> : null}
              {add >= 2 ? <View style={styles.sectionbox}>
                <Text style={styles.sectiontitle}>Image</Text>
                {!dataimage.image3 ? <TouchableOpacity style={styles.addimage} onPress={() => { imagePicker("image3") }}>
                  <Text>Click to</Text><Text>add image</Text>
                </TouchableOpacity> :
                  <View style={styles.imageholder}><View style={styles.imagecontainer}><TouchableOpacity onPress={() => { setimgviewerurl(dataimage.image3.uri) }}><Image style={imgloader == "img3" ? styles.imagesloader : styles.images} source={imgloader == "img3" ? require("../../assets/icons/imgloader.png") : { uri: dataimage.image3.uri }} onLoad={() => setimgloader(false)}></Image></TouchableOpacity></View><TouchableOpacity style={styles.remove} onPress={() => { setDataImg({ ...dataimage, image3: undefined }) }}><Text style={styles.removetxt}>Remove</Text></TouchableOpacity></View>}
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
              </View> : null}
              {add < 2 ? <View style={styles.addcontainer}>
                <TouchableOpacity onPress={() => { setaddd(add + 1) }} style={styles.addbtn}><Image source={require("../../assets/icons/selected_tabcreate.png")}
                  style={{ height: 35, width: 35, resizeMode: "contain", marginRight: 5 }} /><Text style={styles.addtxt}>Add Image</Text></TouchableOpacity>
              </View> : null}
            </View>
            <View style={styles.button}>
              <Button onPress={() => submit()} buttonText="Submit" loading={false} />
            </View>
          </View>
          <Spinner
            visible={spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />

        </View>


      </Container>
      {imgviewerurl && <ImageViewer Url={imgviewerurl} close={() => setimgviewerurl(undefined)} />}
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
  imagesloader: {
    resizeMode: "contain",
    width: wp("5%"),
    height: wp("55%"),
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
    backgroundColor: "#ffffff",
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
  datepickerinput: {
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
  panel: {
    backgroundColor: Bg,
    paddingVertical: hp("2.5%"),
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
    marginBottom: 50,
  },

  datetxt: {
    fontSize: fontsize(1.9),
    color: Theme,
  }
  ,
})

const mstp = state => ({ user: state.user, observation: state.observation })
export default connect(mstp, { fetcharea, fetchsection })(CreateObservation)
