import React, { useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../Components/Features';
import { PermissionsAndroid, Platform } from 'react-native';
import Voice from '@react-native-community/voice';
import { apiCall } from '../Api/openAI';

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
    const [messages, setMessages] = useState([]);
    const [recording, setRecording] = useState(false);
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
            let newMessages = [...messages];
            newMessages.push({ role: 'user', content: result.trim() });
            setMessages(newMessages);
            updateScrollView();
            setLoading(true);
            apiCall(result.trim(), newMessages).then(res => {
                setLoading(false);
                if (res.success) {
                    setMessages(res.data);
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

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView style={{ flex: 1, marginHorizontal: wp(5), marginVertical: hp(3) }}>
                {/* Bot icon */}
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image source={require('../assets/images/bot.jpg')} style={{ height: hp(25), width: wp(55) }} />
                </View>

                {/* Features or messages */}
                {
                    messages.length > 0 ?
                        <View style={{ flex: 1, marginTop: 10 }}>
                            <Text style={{ fontSize: wp(5), color: '#4B5563', fontWeight: 'bold', marginLeft: wp(1) }}>Assistant</Text>
                            <View style={{ height: hp(50), backgroundColor: '#D1D5DB', borderRadius: 20, padding: 10 }}>
                                <ScrollView ref={ScrollViewRef} bounces={false} style={{ flex: 1 }}>
                                    {
                                        messages.map((msg, index) => (
                                            <View key={index} style={{ flexDirection: msg.role === 'assistant' ? 'row-reverse' : 'row' }}>
                                                <View style={{ maxWidth: wp(70), backgroundColor: msg.role === 'assistant' ? '#D1FAE5' : 'white', borderRadius: 10, padding: 10, marginVertical: 5 }}>
                                                    <Text style={{ color: '#000' }}>{msg.content}</Text>
                                                </View>
                                            </View>
                                        ))
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
                            <Image source={require('../assets/images/voice.png')} style={{ width: hp(8), height: hp(8) }} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={startRecording} style={{ padding: 10 }}>
                            <Image source={require('../assets/images/mic.png')} style={{ width: hp(8), height: hp(8) }} />
                        </TouchableOpacity>
                    )}

                    {messages.length > 0 && (
                        <TouchableOpacity onPress={clear} style={{ backgroundColor: '#6B7280', borderRadius: 20, padding: 10, position: 'absolute', right: 10 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </View>
    )
}
