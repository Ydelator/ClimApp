import React, { useEffect, useState } from 'react'
import { Text, View, Image, Pressable, ImageBackground, StyleSheet} from 'react-native'
import { useFonts } from 'expo-font'
import parameters from '../data/parameters.js'

import * as Location from 'expo-location'

const Main = () => {
    const [fontsLoaded] = useFonts({
        'Inter-Black': require('../../assets/fonts/Inter-Black.otf'),
        'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf')
    })

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [data, setData] = useState({})
    const [local, setLoc] = useState({})
    const [loading, setLoading] = useState(true)
    const [condition, setCond] = useState('')
    const [icondition, setICond] = useState(null)

    useEffect(()=>{
        (async () => {
      
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            await fetch(`http://api.weatherapi.com/v1${parameters.current}key=${parameters.key}&q=${location.coords.latitude},${location.coords.longitude}&aqi=no`)
                    .then((res)=> res.json())
                    .then((data) => {
                        setLoc(data.location)
                        setData(data.current)
                        setLoading(false)
                        setICond(data.current.condition.icon)
                        setCond(data.current.condition.text)
                    })
          })();
    }, [])

    let long = ''
    let lat = ''
    let coords = 'Waiting..'
    if (errorMsg) {
        coords = errorMsg;
    } else if (location) {
        long = location.coords.longitude;
        lat = location.coords.latitude;
        coords = `${lat},${long}`
        
    }

    if (loading == true) {
        return (
            <View style={styles.father}>
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
            </View>
        )
    }else{
        return (
            <View style={styles.father}>
                <View style={styles.container}>
                    <Text style={styles.text}>{local.name}</Text>
                    <Text>{condition}</Text>   
                    <View style={styles.container_horizontal}>
                        <Image 
                            style={{width: 100, height: 100}}
                            source={{
                                uri: `https:${icondition}`
                        }}/>
                        <View>
                            <Text style={styles.text_temp}>{data.temp_c}°C</Text>
                            <Text style={styles.text_temp}>{data.temp_f}°F</Text>
                        </View>
                    </View>
                    <Text style={styles.text_secondary}>Thermal sensation</Text>
                    <View style={styles.container_horizontal}>
                        <Text>{data.feelslike_c}°C</Text>
                        <Text>{data.feelslike_f}°F</Text>
                    </View>
                    <Text>{local.name}, {local.region}, {local.country}</Text>
                    <Text>{local.localtime}</Text>        
                    <Text>{data.wind_kph} km/h</Text>
                    <Text>{data.precip_mm} mm</Text>
                    <Text>{data.humidity}%</Text>
                    <Text>{coords}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#ffffff70',
        padding: 35,
        width: '90%',
        height: '90%',
        borderRadius: 15,
        gap: 5
    },
    father: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'Poppins-Bold',
        fontWeight: '600',
        fontSize: 25
    },
    container_horizontal: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderRadius: 15,
    },
    text_temp: {
        fontFamily: 'Inter-Black',
        fontWeight: '600',
        fontSize: 15
    },
    text_secondary: {
        fontFamily: 'Poppins-Bold',
        fontWeight: '600',
        fontSize: 15
    },
})

export default Main