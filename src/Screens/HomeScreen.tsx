import React, { useState } from 'react'
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../Components/Features';
import { DummyMessage } from '../Constants/DummyMessages';

export default function HomeScreen() {
    const [messages, setMessages] = useState(DummyMessage);
    const [recornding, setRecording] = useState(false)
    const [speaking, setSpeaking] = useState(false)
    const clear = () => {
        setMessages([]);
    }
    const stop = () => {
        setSpeaking(false)
    }
    return (
        <View className='flex-1 bg-white'>
            <SafeAreaView className='flex-1 flex mx-5 my-3'>
                {/* bot icon */}
                <View className='flex-row justify-center mb-10'>
                    <Image source={require('../assets/images/bot.jpg')}
                        style={{ height: hp(25), width: wp(55) }}
                    />
                </View>

                {/* features || meassages */}
                {
                    messages.length > 0 ?
                        <View className='space-y-2 flex-1'>
                            <Text style={{ fontSize: wp(5) }} className='text-gray-700 font-semibold ml-1'>
                                Assistant
                            </Text>
                            <View style={{ height: hp(50) }} className='bg-neutral-200 rounded-3xl p-4'>
                                <ScrollView bounces={false} className='space-y-4' showsVerticalScrollIndicator={false} >
                                    {
                                        messages.map((messages, index) => {
                                            if (messages.role == 'assistant') {
                                                if (messages.content.includes('https')) {
                                                    //ai image
                                                    return (
                                                        <View key={index} className='flex-row justify-start'>
                                                            <View className='p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none'>
                                                                <Image
                                                                    source={{ uri: messages.content }}
                                                                    className='rounded-2xl'
                                                                    resizeMode='contain'
                                                                    style={{ height: wp(60), width: wp(60) }}
                                                                />
                                                            </View>
                                                        </View>
                                                    )
                                                } else {
                                                    //text response
                                                    return (
                                                        <View key={index} className='flex-row justify-end'>
                                                            <View style={{ width: wp(70) }} className='bg-emerald-100 rounded-xl p-2 rounded-tl-none'>
                                                                <Text className='text-black'>{messages.content}</Text>
                                                            </View>
                                                        </View>
                                                    )

                                                }
                                            } else {
                                                return (
                                                    <View key={index} className='flex-row justify-end'>
                                                        <View style={{ width: wp(70) }} className='bg-white rounded-xl p-2 rounded-tr-none'>
                                                            <Text className='text-black'>{messages.content}</Text>
                                                        </View>
                                                    </View>
                                                )

                                            }
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View> : (
                            <Features />
                        )
                }
                {/* recornding , clear */}
                <View className='flex justify-center items-center'>
                    {
                        recornding ? (
                            <TouchableOpacity className='pb-3'>
                                <Image
                                    source={require('../assets/images/voice.png')}
                                    style={{ width: hp(8), height: hp(8) }}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity className='pb-3'>
                                <Image
                                    source={require('../assets/images/mic.png')}
                                    style={{ width: hp(8), height: hp(8) }}

                                />
                            </TouchableOpacity>
                        )
                    }
                    {
                        messages.length > 0 && (
                            <TouchableOpacity onPress={clear} className='bg-neutral-400 rounded-3xl p-2 absolute right-10'>
                                <Text className='text-white font-semibold'>Clear</Text>
                            </TouchableOpacity>
                        )
                    }
                    {
                        speaking && (
                            <TouchableOpacity onPress={stop} className='bg-red-400 rounded-3xl p-2 absolute left-10'>
                                <Text className='text-white font-semibold'>Stop</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </SafeAreaView>
        </View>
    )
}