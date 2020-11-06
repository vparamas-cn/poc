import React from 'react'
import { Platform , Image} from "react-native";

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from "./src/pages/Login"
import Dashboard from "./src/pages/Dashboard"
import { Theme } from './src/lib/constants';

import ObservationList from "./src/pages/Observation/List"
import ObservationView from "./src/pages/Observation/View"
import ObservationCreate from "./src/pages/Observation/Create"
import ObservationEdit from "./src/pages/Observation/Edit"
import Action from "./src/pages/Actions"
import { connect } from 'react-redux'
import { verify, stopLoading } from './src/redux/actions/auth.actions'

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const App = props => {

  const { user } = props
  const Auth = () =>
  <Stack.Navigator screenOptions={{ headerShown: false }}>     
      <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
  const Dashboard = () =>
  <Stack.Navigator screenOptions={{ headerShown: false }}>    
      <Stack.Screen name="Home" component={BottomTab} />
      <Stack.Screen name="Observation" component={ObservationList} />
      <Stack.Screen name="ViewObservation" component={ObservationView} />
      <Stack.Screen name="CreateObservation" component={ObservationCreate} />
      
  </Stack.Navigator>
  return (
    <NavigationContainer>
        {user.isAuthenticated? <Dashboard />:<Auth/>}
    </NavigationContainer>
  )

};
const ObservationStack =()=>{
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>     
      <Stack.Screen name="Observation" component={ObservationList} />
      <Stack.Screen name="ViewObservation" component={ObservationView} />
      <Stack.Screen name="EditObservation" component={ObservationEdit} />
  </Stack.Navigator>
  )
}
const BottomTab = ()=> {


    return (
      <Tab.Navigator
        initialRouteName={Dashboard}
        tabBarOptions={{
          activeTintColor: Theme,
          inactiveTintColor: "#474747",
          style: Platform.OS === "android"?{
            paddingBottom: 3,
            borderColor: Theme,
            position: "absolute",
            borderTopColor: "transparent",
            height: 50
          }:{},

          labelStyle: { fontSize: 8 }
        }}>

        <Tab.Screen name="Home" component={Dashboard} options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            color ===  "#474747"? <Image source={require("./src/assets/icons/home.png")}
              style={{ height: 25, width: 25, resizeMode: "contain" }} />:
              <Image source={require("./src/assets/icons/selected_home.png")}
              style={{ height: 25, width: 25, resizeMode: "contain" }} />
          )
        }} />
        <Tab.Screen name="CreateObservation" component={ObservationCreate} options={{
          tabBarLabel: "Create",
          tabBarIcon: ({ color }) => (
            color ===  "#474747"?<Image source={require("./src/assets/icons/tabcreate.png")}
            style={{ height: 25, width: 25,  resizeMode: "contain" }} />:
            <Image source={require("./src/assets/icons/selected_tabcreate.png")}
            style={{ height: 25, width: 25,  resizeMode: "contain" }} />
        )

        }} />
        <Tab.Screen name="Observation" component={ObservationStack} options={{
          tabBarLabel: 'Observation',
          tabBarIcon: ({ color }) => (
            color ===  "#474747"?<Image source={require("./src/assets/icons/tabobservation.png")}
              style={{ height: 25, width: 25,  resizeMode: "contain" }} />:
              <Image source={require("./src/assets/icons/selected_tabobservation.png")}
              style={{ height: 25, width: 25,  resizeMode: "contain" }} />
          )

        }} />
        <Tab.Screen name="Actions" component={Action} options={{
          tabBarLabel: 'Action',
          tabBarIcon: ({ color }) => (
            color ===  "#474747"?<Image source={require("./src/assets/icons/action.png")}
              style={{ height: 25, width: 25, resizeMode: "contain" }} />:
              <Image source={require("./src/assets/icons/selected_action.png")}
              style={{ height: 25, width: 25, resizeMode: "contain" }} />
          )

        }} />
       
      </Tab.Navigator>
    )
  
}


const mstp = state => ({ user: state.user })
export default connect(mstp, { verify, stopLoading })(App)
