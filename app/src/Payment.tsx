import { Alert, Dimensions, Platform, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import MapView, { LatLng, PROVIDER_GOOGLE, Polygon } from 'react-native-maps'
import React, { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-community/async-storage'
import Loading from './Loading'
import RazorpayCheckout from 'react-native-razorpay'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native'

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
	const [isSuccess, setIsSuccess] = useState<boolean>(false)
	const [isFailure, setIsFailure] = useState<boolean>(false)
	const [isPressed, setIsPressed] = useState<boolean>(false)
	const route = useRoute()
	const data = route.params as Data

	const getJWT = async () => {
		const jwt = await AsyncStorage.getItem('userJWT')
		if (jwt) {
			setJWT(jwt)
		}
	}

	const processCheckout = async () => {
		fetch(
			`http://3.20.66.6:8080/payment/initiate?khasraNo=${data.khasra}&village=${data.village}&subDistrict=${data.subDistrict}&district=${data.district}&state=${data.state}`,
			{
				headers: {
					Authorization: `Bearer ${JWT}`,
				},
			},
		)
			.then((res) => res.json())
			.then((data) => {
				setIsPressed(true)
				const options = {
					key: 'rzp_test_LxNLqxDW2AdrOo',
					amount: data.amount,
					name: 'LRSP',
					currency: 'INR',
					order_id: data.order_id,
				}
				RazorpayCheckout.open(options)
					.then(
						({
							razorpay_payment_id,
							razorpay_order_id,
							razorpay_signature,
						}: {
							razorpay_payment_id: string
							razorpay_order_id: string
							razorpay_signature: string
						}) => {
							fetch(
								`http://3.20.66.6:8080/payment/verify?order_id=${data.order_id}&razorpay_payment_id=${razorpay_payment_id}&razorpay_order_id=${razorpay_order_id}&razorpay_signature=${razorpay_signature}`,
								{
									headers: {
										Authorization: `Bearer ${JWT}`,
									},
								},
							)
							setIsSuccess(true)
							setIsPressed(false)
						},
					)
					.catch((err) => {
						if (Platform.OS === 'ios') {
							Alert.alert(JSON.stringify(err))
						} else {
							ToastAndroid.show(JSON.stringify(err), ToastAndroid.LONG)
						}
						setIsPressed(false)
						setIsFailure(true)
					})
			})
			.catch((err) => {
				if (Platform.OS === 'ios') {
					Alert.alert(JSON.stringify(err))
				} else {
					ToastAndroid.show(JSON.stringify(err), ToastAndroid.LONG)
				}
				setIsPressed(false)
				setIsFailure(true)
			})
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

	if (isFailure) {
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center', width, height }}>
				<Text style={{ fontSize: 20 }}>Payment failed, please try again</Text>
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
					style={[styles.containerTouchableOpacity, { backgroundColor: isPressed ? 'rgba(12, 13, 52, 0.05)' : '#2CB9B0' }]}
					onPress={isPressed ? () => true : processCheckout}>
					<Text style={[styles.label, { color: '#fff' }]}>Continue with Payment</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default Payment
