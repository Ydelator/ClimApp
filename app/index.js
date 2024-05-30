import { StyleSheet, View, ImageBackground, FlatList, Text, SafeAreaView, TextInput, Button } from 'react-native';
import Main from '../src/components/Main';
import react, { useEffect } from 'react';
import amanecer from '../assets/img/Amanecer.jpg'
import mediodia from '../assets/img/Mediodia.jpg'
import noche from '../assets/img/Noche.jpeg'
import { useState } from 'react';
import colombiaCities from '../src/data/colombiaCities.js';
import filter from 'lodash.filter';
import { Link } from 'expo-router';
import parameters from '../src/data/parameters.js';
import unorm from 'unorm';
import { useFonts } from 'expo-font';

export default function App() {
    
    const [fontsLoaded] = useFonts({
        'Inter-Black': require('../assets/fonts/Inter-Black.otf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf')
    })

  const [dateTime, setDateTime] = useState(new Date())
  const [image, setImage] = useState('')

  const [searchQ, setSearchQ] = useState('')
  const [filterList, setFilter] = useState([])

  useEffect(()=>{
    getDate()
    if (dateTime.getHours() >= 5 && dateTime.getHours() <= 8) {
      setImage(amanecer)
    }else{
      if (dateTime.getHours() >= 9 && dateTime.getHours() <= 15) {
        setImage(mediodia)
      }else{
        if (dateTime.getHours() >= 16 && dateTime.getHours() <= 18) {
          setImage(amanecer)
        }else{
          setImage(noche)
        }
      }
    }
    
    parameters.actDate = `${dateTime.getFullYear()}-${dateTime.getMonth()+1}-${dateTime.getDate()}`

    let fiveteendays = 1000 * 60 * 60 * 24 * 15
    let rest = dateTime.getTime() - fiveteendays
    let pastDate = new Date(rest)
    parameters.pastDate = `${pastDate.getFullYear()}-${pastDate.getMonth()+1}-${pastDate.getDate()}`
  },[])

  const getDate = () => {
    const tmer = setInterval(()=>{
        setDateTime(new Date())
    }, 1000)
    return () => clearInterval(tmer)
  }

  const search = (text) => {
    if (text) {
        const newData = colombiaCities.filter((item) =>{
            const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        setFilter(newData)
        setSearchQ(text)
    } else {
        setFilter(colombiaCities)
        setSearchQ(text)
    }
  }

  const removeAccents = (str) => {
    return unorm.nfd(str).replace(/[\u0300-\u036f]/g, '');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode='cover' style={styles.background}>
        <SafeAreaView style={styles.SearchBar}>
            <TextInput 
            placeholder='Search'
            value={searchQ}
            onChangeText={(query) => search(query)}
            style={{
                fontFamily: 'Inter-Black',
                textAlign: 'center'
            }}
            />
        </SafeAreaView>
        <View style={styles.List}>
            <View style={styles.Option}>
                <Link href="/forecast" onPress={() => parameters.city = ''}>
                    <Text style={styles.optionText}>
                        Current
                    </Text>
                </Link>         
            </View>
            <FlatList
            data={filterList}
            initialNumToRender={20}
            keyExtractor={(item) => item.id}
            renderItem={({item})=> 
            <View style={styles.Option}>
                <Link href="/forecast" onPress={() => parameters.city = removeAccents(item.name)}>
                    <Text style={styles.optionText}>
                        {item.name}
                    </Text>
                </Link>           
            </View>}
            />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    background: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
        },
    SearchBar: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '90%',
        height: 35,
        marginTop: 15,
        backgroundColor:'#ffffff90',
        borderRadius: 10,
        padding: 5
    },
    List: {
        width: '85%',
        backgroundColor: '#ffffff90',
        marginTop: 15,
        height: '50%',
        overflow: 'hidden',
        borderRadius: 5,
    },
    Option: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
        backgroundColor: '#00000090',
        padding: 5,
        marginBottom: 5,
    },
    optionText: {
        color: '#fff',
        fontFamily: 'Inter-Black'
    }
});