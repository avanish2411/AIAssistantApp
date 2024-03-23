import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Image, Animated } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

<<<<<<< HEAD
=======

>>>>>>> e5e32b5fc689e3eb7f00b05e195be749d190a932
export default function WelcomeScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView className='flex-1 flex justify-around bg-white'>
            <View className='space-y-2'>
                <Text style={{ fontSize: wp(10) }} className='text-center font-bold text-gray-700'>
                    Jarvis
                </Text>
                <Text style={{ fontSize: wp(4) }} className='text-center tracking-wider text-gray-600 font-semibold'>
                    The Future is here,powered by AI.
                </Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <Image
                    source={require('../assets/images/bot.jpg')}
                    style={{ width: wp(75), height: wp(75),}}
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} className='bg-emerald-600 mx-5 p-4 rounded-2xl'>
                <Text style={{ fontSize: wp(6) }} className='text-center font-bold text-white text-2xl'>Get Started</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}