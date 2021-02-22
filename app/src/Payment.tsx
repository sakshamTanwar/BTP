import { ActivityIndicator, Alert, Dimensions, Platform, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import MapView, { LatLng, PROVIDER_GOOGLE, Polygon } from 'react-native-maps'
import React, { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-community/async-storage'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native'
import Loading from './Loading'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	container: {
		width,
		height: height * 0.674,
	},
	result: {
		borderWidth: 1,
		borderColor: '#666',
		width: '100%',
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	containerTouchableOpacity: {
		borderRadius: 25,
		height: 50,
		width: 245,
		justifyContent: 'center',
		alignItems: 'center',
	},
	label: {
		fontSize: 15,
		textAlign: 'center',
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	text: {
		fontSize: 20,
		textTransform: 'capitalize',
	},
})

interface Data {
	khasra: string
	village: string
	subDistrict: string
	district: string
	state: string
	location: LatLng
	points: LatLng[]
}

const Payment = () => {
	const [JWT, setJWT] = useState('')
	const [isPressed, setIsPressed] = useState<boolean>(false)
	const [isProccessed, setIsProccessed] = useState<boolean>(false)
	const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false)
	const [isSuccess, setIsSuccess] = useState<boolean>(false)
	const [checking, setIsChecking] = useState<boolean>(false)
	const route = useRoute()
	const data = route.params as Data

	const getJWT = async () => {
		const jwt = await AsyncStorage.getItem('userJWT')
		if (jwt) {
			setJWT(jwt)
		}
	}

	useEffect(() => {
		getJWT()
	}, [])

	if (!data || !JWT) {
		return <Loading />
	}

	if (isSuccess) {
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center', width, height }}>
				<Text style={{ fontSize: 20 }}>Payment successed, your report will be mailed to you shortly</Text>
			</View>
		)
	}

	if (isPressed && isProccessed) {
		if (checking) {
			setTimeout(() => {
				setIsChecking(false)
			}, 1000)
		} else {
			if (isPaymentSuccess) {
				fetch(
					'http://3.20.66.6:8080/landrecord/generate?' +
						new URLSearchParams({
							khasra: data.khasra,
							village: data.village,
							subDistrict: data.subDistrict,
							district: data.district,
							state: data.state,
						}),
					{
						headers: {
							Authorization: `Bearer ${JWT}`,
						},
					},
				)
					.then((res) => res.json())
					.then((res) => {
						if (res.success) {
							setIsSuccess(true)
						} else {
							if (Platform.OS === 'ios') {
								Alert.alert(JSON.stringify(res))
							} else {
								ToastAndroid.show(JSON.stringify(res), ToastAndroid.LONG)
							}
							setIsSuccess(false)
						}
					})
					.catch((err) => {
						console.log(err)
						if (Platform.OS === 'ios') {
							Alert.alert(JSON.stringify(err))
						} else {
							ToastAndroid.show(JSON.stringify(err), ToastAndroid.LONG)
						}
					})
			} else {
				return (
					<View style={{ justifyContent: 'center', alignItems: 'center', width, height }}>
						<Text style={{ fontSize: 20 }}>Payment failed please try again</Text>
					</View>
				)
			}
		}
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center', width, height }}>
				<ActivityIndicator color="black" size="large" />
				<Text style={{ fontSize: 20 }}>Confirming your payment status</Text>
			</View>
		)
	}

	if (isPressed) {
		return (
			<View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
				<View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
					<TouchableOpacity
						style={[styles.containerTouchableOpacity, { backgroundColor: '#2CB9B0' }]}
						onPress={() => {
							setIsProccessed(true)
							setIsPaymentSuccess(true)
							setIsChecking(true)
						}}>
						<Text style={[styles.label, { color: '#fff' }]}>Payment Success</Text>
					</TouchableOpacity>
				</View>
				<View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
					<TouchableOpacity
						style={[styles.containerTouchableOpacity, { backgroundColor: '#2CB9B0' }]}
						onPress={() => {
							setIsProccessed(true)
							setIsPaymentSuccess(false)
							setIsChecking(true)
						}}>
						<Text style={[styles.label, { color: '#fff' }]}>Payment Failed</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.mainContainer}>
			<View style={styles.container}>
				<MapView
					style={styles.map}
					initialRegion={{
						...data.location,
						latitudeDelta: 0.002,
						longitudeDelta: 0.002,
					}}
					provider={PROVIDER_GOOGLE}>
					{/* <Marker coordinate={data.location} /> */}
					<Polygon coordinates={data.points} strokeColor="rgba(44, 185, 176, 0.2)" fillColor="rgba(44, 185, 176, 0.2)" />
				</MapView>
			</View>
			<View style={styles.result}>
				<Text style={styles.text}>Khasra No: {data.khasra}</Text>
				<Text style={styles.text}>Village: {data.village}</Text>
				<Text style={styles.text}>Sub District: {data.subDistrict}</Text>
				<Text style={styles.text}>District: {data.district}</Text>
				<Text style={styles.text}>State: {data.state}</Text>
			</View>
			<View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
				<TouchableOpacity
					style={[styles.containerTouchableOpacity, { backgroundColor: '#2CB9B0' }]}
					onPress={() => setIsPressed(true)}>
					<Text style={[styles.label, { color: '#fff' }]}>Continue with Payment</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Payment
