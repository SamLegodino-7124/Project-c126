import * as React from "react"
import { Button,View,Image,Platform } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
    state ={
        image:null
    };
    render(){
        let {image} = this.state
        return(
            <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                <Button title = "Pick an Image from Camera Roll" onPress= {this.PickImage}/>
                </View>
        )

    }
    componentDidMount(){
        this.getpermissionasync()
    }

    getpermissionasync = async()=>{
        if(Platform.OS!=="web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLE)
            if( status!=="granted"){
                alert("Sorry we need Camera Roll Permission to make this work")

            }
        }
    };

    uploadImage = async(uri)=>{
        const data = new FormData()
        let FileName = uri.split("/")[uri.split("/").length-1]
        let type = `image/${uri.split(".")[uri.split(".").length-1]}`
        const filetoupload = {
            uri:uri,
            name:FileName,
            type:type

        };
        data.append("digit",filetoupload)
        fetch("https://81543e73960e.ngrok.io/predict-digit",{
            method:"POST",
            body:data,
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then((response)=>response.json())
        .then((result)=>{
            console.log("Success",result)
        })
        .catch((E)=>{
            console.error("error",E)
        })
    }
    pickimage = async ()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.ALL,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            });
            if (!result.cancelled){
                this.setState({image:result.data})
                this.uploadImage(result.uri)
            }
            
        }
    
    catch(E){
        console.log(E)
    }
}
}