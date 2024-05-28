import { StyleSheet, View, ImageBackground } from 'react-native';
import Main from './src/components/Main';
import react, { useEffect } from 'react';
import amanecer from './assets/img/Amanecer.jpg'
import mediodia from './assets/img/Mediodia.jpg'
import noche from './assets/img/Noche.jpeg'
import { useState } from 'react';

export default function App() {

  const [dateTime, setDateTime] = useState(new Date())
  const [image, setImage] = useState('')

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
  },[])

  const getDate = () => {
    const tmer = setInterval(()=>{
        setDateTime(new Date())
    }, 1000)
    return () => clearInterval(tmer)
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode='cover' style={styles.background}>
        <Main/>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%'
}
});
