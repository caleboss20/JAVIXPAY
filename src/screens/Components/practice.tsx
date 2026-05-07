 //====for practicing fetching data======//
import { axios } from 'axios'
import { useState } from "react";
import { Alert ,View,Text} from "react-native";
import { FlatList } from 'react-native-gesture-handler';

  
  const endpointURL=`https://open.er-api.com/v6/latest/${fromCountry.currency}`
  const getdata=async()=>{
  const response=await axios.get(endpointURL);
  console.log(response.data);
  setData(response.data);
  }
//for get request//
  const [data,setData]=useState([]);

const getDataId=async()=>{
  try {
    const response=await axios.get(endpointURL+"/3");
  console.log(response.data);
  setData(response.data);
  } 
  catch (err) {
     console.log("Is not you is us",err);
  }

}
//for delete request//

const deleteBookById=async()=>{
  try {
 const response=await axios.delete(`${endpointURL}/4`);
 Alert.alert("Book is deleted");
    
  } catch(error) {
    console.log("an error occured",error);

  }
}

//for post request//
const body=
   {
  user:'Abigail Biney',
  name:'caleboss yoghurt',
  price:12,
  deliveryTime:'60 mins', 
}
const Adddata=async()=>{
try {
  const response=await axios.post(endpointURL,
    //for the data
body
)
Alert.alert("created successfully");
//run getting of item function here//
getDataId();
  
} catch (error) {
 console.log("couldn't add information");  
}

}

//for put request==for updating the database//

const UpdateData =async()=>{
  try{
  const response=await axios.put(`${endpointURL}/4`,body)
Alert.alert("book has been updated successfully");  
}
  catch(err){
 console.log("couldn't update data");
  }
}


const Practice=()=>{
  return(
    <View>
        {/* //for practicing */}
              <FlatList 
              data={data}
              keyExtractor={(info)=>info.id}
              renderItem={({info})=>
              <Text>{info.name}</Text>
              
              }
      
              
              />
    </View>
  )
}