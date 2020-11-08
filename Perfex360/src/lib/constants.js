
import {widthPercentageToDP as widthp, heightPercentageToDP as heightp} from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
export const baseUrl = 'http://52.66.249.22:3000/api'
export const Theme="#0c588b";
export const LightTheme="#0c588b"
export const Bg="#F8F7F5"
export const wp =(val) =>{
  return widthp(val)
};
export const hp=(val) =>{
  return heightp(val)
};
export const fontsize=(val)=>{
  return RFPercentage(val)
}
export const api = {
  login: baseUrl + '/user',
  loadlist: baseUrl + '/observation',
  getarea: baseUrl+ '/area',
  getsection: baseUrl+ '/section',
  createobservation: baseUrl+ '/createobservation',
  fileupload: baseUrl+ '/fileupload',
}