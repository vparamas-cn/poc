import AsyncStorage from '@react-native-community/async-storage'
export const groupby = (list,type) => {
    return list.reduce((groups, item) => {
        const group = (groups[item[type]] || []);
        group.push(item);
        groups[item[type]] = group;
        return groups;
      }, {});
}
export const setStorage = async (value) => {
  try {
    let datapreviews = getStorage("observation_pending");
    if(datapreviews.length >=20){
      datapreviews.pop();
    }
    datapreviews.unshift(value);
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    // saving error
  }
}
export const getStorage =async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("observation_pending")
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}
