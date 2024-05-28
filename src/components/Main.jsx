import React, { useEffect, useState } from 'react'
import { Text, View, Image, Pressable, ImageBackground, StyleSheet} from 'react-native'
import parameters from '../data/parameters.js'


const Main = () => {

    const [data, setData] = useState({})
    const [local, setLoc] = useState({})
    const [loading, setLoading] = useState(false)
    const [condition, setCond] = useState('')
    const [icondition, setICond] = useState(null)

    useEffect(()=>{
        getWeather()
    }, [])

    const getWeather = async () => {
        setLoading(true)
         await fetch(`http://api.weatherapi.com/v1${parameters.current}key=${parameters.key}&q=${parameters.location}&aqi=no`)
                .then((res)=> res.json())
                .then((data) => {
                    setLoc(data.location)
                    setData(data.current)
                    setLoading(false)
                    setICond(data.current.condition.icon)
                    setCond(data.current.condition.text)
                })

    }

    if (loading == true) {
        return (
            <View>
                <View style={styles.container}>
                    <Text>Cargando...</Text>
                </View>
            </View>
        )
    }else{
        return (
            <View style={styles.father}>
                <View style={styles.container}>
                    <Text>{local.name}, {local.region}, {local.country}</Text>
                    <Text>{local.localtime}</Text>
                    <View>
                        <Text>{data.temp_c}°C</Text>
                        <Text>{data.temp_f}°F</Text>
                    </View>
                    <View>
                        <Text>{data.feelslike_c}°C</Text>
                        <Text>{data.feelslike_f}°F</Text>
                    </View>
                    <Text>{condition}</Text>
                    <Image 
                        style={{width: 50, height: 50}}
                        source={{
                            uri: `https:${icondition}`
                    }}/>
                    <Text>{data.wind_kph} km/h</Text>
                    <Text>{data.precip_mm} mm</Text>
                    <Text>{data.humidity}%</Text>
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
        width: '60%',
        borderRadius: 15,
        gap: 10
    },
    father: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Main