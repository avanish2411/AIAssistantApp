import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../Components/Features';
import { PermissionsAndroid, Platform } from 'react-native';
import Voice from '@react-native-community/voice';
import { apiCall } from '../Api/openAI';
import { DummyMessage } from '../Constants/DummyMessages';

async function requestRecordAudioPermission() {
    try {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: 'Voice Permission',
                    message: 'App needs access to your microphone to record audio.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Record audio permission granted');
            } else {
                console.log('Record audio permission denied');
            }
        }
    } catch (err) {
        console.warn(err);
    }
}

export default function HomeScreen() {
    const [messages, setMessages] = useState(DummyMessage)
    const [recording, setRecording] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [result, setResult] = useState('');
    const ScrollViewRef = useRef();
    const [loading, setLoading] = useState(false);

    const speechStartHandler = () => {
        console.log("Speech start handler");
    };

    const speechEndHandler = () => {
        setRecording(false);
        console.log('Speech end Handler');
    }

    const speechResultHandler = (e) => {
        console.log('voice event', e);
        const text = e.value[0]
        setResult(text);
    }

    const speechErrorHandler = (e) => {
        console.log('speech error', e);
    }

    const startRecording = async () => {
        setRecording(true);
        try {
            await Voice.start('en-US');
        } catch (error) {
            console.log(error);
        }
    }
    // console.log(result);
    const stopRecording = async () => {
        try {
            await Voice.stop();
            setRecording(false);
            // Fetch result
            fetchResponse();
        } catch (error) {
            console.log(error);
        }
    }

    const fetchResponse = () => {
        if (result.trim().length > 0) {
            //add usermessages
            let newMessages = [...messages];
            newMessages.push({ role: 'user', content: result.trim()});
            setMessages([...newMessages]);
            updateScrollView();
            setLoading(true);
            apiCall(result.trim(), newMessages).then(res => {
                setLoading(false);
                if (res.success) {
                    setMessages([...res.data]);
                    updateScrollView();
                    setResult('');
                } else {
                    Alert.alert("Error", res.msg);
                }
            });
        }
    }

    const updateScrollView = () => {
        setTimeout(() => {
            ScrollViewRef?.current?.scrollToEnd({ animated: true });
        })
    }

    const clear = () => {
        setMessages([]);
    }

    const stopSpeaking = () => {
        setSpeaking(false)
    }

    useEffect(() => {
        Voice.onSpeechStart = speechStartHandler;
        Voice.onSpeechEnd = speechEndHandler;
        Voice.onSpeechResults = speechResultHandler;
        Voice.onSpeechError = speechErrorHandler;
        return () => {
            // Destroy the voice instance
            Voice.destroy().then(Voice.removeAllListeners);
        }
        requestRecordAudioPermission();
    }, []);

    console.log('result: ',result);

    return (
        <View className='flex-1 bg-white'>
            <SafeAreaView className='flex-1 flex mx-5'>
                {/* Bot icon */}
                <View className='flex-row justify-center'>
                    <Image source={require('../assets/images/bot.jpg')} style={{ height: hp(25), width: wp(55) }} />
                </View>

                {/* Features or messages */}
                {
                    messages.length > 0 ?
                        <View className='space-y-2 flex-1'>
                            <Text style={{ fontSize: wp(5) }} className='text-gray-700 font-semibold ml-1'>Assistant</Text>
                            <View style={{ height: hp(58) }} className='bg-neutral-200 rounded-3xl p-4'>
                                <ScrollView ref={ScrollViewRef} bounces={false} showsVerticalScrollIndicator={false} className='space-y-2'>
                                    {
                                        messages.map((message, index) => {
                                            if (message.role == 'assistant') {
                                                if (message.content.includes('https')) {
                                                    return (
                                                        <View key={index} className='flex-row justify-start'>
                                                            <View className='p-2 rounded-2xl bg-emerald-100 rounded-tl-none'>
                                                                <Image
                                                                    source={{ uri: message.content }}
                                                                    style={{ height: wp(60), width: wp(60) }}
                                                                    className='rounded-2xl'
                                                                    resizeMode='contain'
                                                                />
                                                            </View>
                                                        </View>
                                                    )
                                                } else {
                                                    return (
                                                        <View key={index} className='flex-row justify-start'>
                                                            <View style={{ fontSize: wp(70) }} className='bg-emerald-100 rounded-xl p-2 rounded-tl-none'>
                                                                <Text className='text-black'>{message.content}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                }
                                            } else {
                                                return (
                                                    <View key={index} className='flex-row justify-end'>
                                                        <View style={{ fontSize: wp(70) }} className='bg-white rounded-xl p-2 rounded-tr-none'>
                                                            <Text className='text-black'>{message.content}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View> :
                        <View style={{ marginBottom: 17 }}>
                            <Features />
                        </View>
                }

                {/* Recording and clear */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#000" style={{ marginRight: 10 }} />
                    ) : recording ? (
                        <TouchableOpacity onPress={stopRecording} style={{ padding: 10 }}>
                            <Image source={require('../assets/images/voice.png')} style={{ width: hp(8), height: hp(8) }} className='rounded-full' />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={startRecording} style={{ padding: 10 }}>
                            <Image source={require('../assets/images/mic.png')} style={{ width: hp(8), height: hp(8) }} className='rounded-full' />
                        </TouchableOpacity>
                    )}

                    {messages.length > 0 && (
                        <TouchableOpacity onPress={clear} className='bg-neutral-400 rounded-3xl p-2 absolute right-10'>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Clear</Text>
                        </TouchableOpacity>
                    )}
                    {speaking && (
                        <TouchableOpacity onPress={stop} className='bg-red-400 rounded-3xl p-2 absolute left-10'>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </View>
    )
}
