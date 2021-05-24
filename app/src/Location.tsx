import {
	ActivityIndicator,
	Alert,
	Dimensions,
	Image,
	Linking,
	PermissionsAndroid,
	Platform,
	StyleSheet,
	Text,
	ToastAndroid,
	View,
} from 'react-native'
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import React, { createRef, useEffect, useState } from 'react'

import AsyncStorage from '@react-native-community/async-storage'
import Geolocation from 'react-native-geolocation-service'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import Loading from './Loading'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
	mainContainer: {
		width,
		height,
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	containerTouchableOpacity: {
		borderRadius: 25,
		height: 50,
		width: width * 0.9,
		justifyContent: 'center',
		alignItems: 'center',
	},
	label: {
		fontSize: 15,
		textAlign: 'center',
	},
})

const hasLocationPermissionIOS = async () => {
	const openSetting = () => {
		Linking.openSettings().catch(() => {
			Alert.alert('Unable to open settings')
		})
	}
	const status = await Geolocation.requestAuthorization('whenInUse')

	if (status === 'granted') {
		return true
	}

	if (status === 'denied') {
		Alert.alert('Location permission denied')
	}

	if (status === 'disabled') {
		Alert.alert('Turn on Location Services to determine your location.', '', [
			{ text: 'Go to Settings', onPress: openSetting },
			{ text: "Don't Use Location", onPress: () => null },
		])
	}

	return false
}

const hasLocationPermission = async () => {
	if (Platform.OS === 'ios') {
		const hasPermission = await hasLocationPermissionIOS()
		return hasPermission
	}

	if (Platform.OS === 'android' && Platform.Version < 23) {
		return true
	}

	const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)

	if (hasPermission) {
		return true
	}

	const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)

	if (status === PermissionsAndroid.RESULTS.GRANTED) {
		return true
	}

	if (status === PermissionsAndroid.RESULTS.DENIED) {
		ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG)
	} else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
		ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG)
	}

	return false
}

const LocationComponent = () => {
	const [JWT, setJWT] = useState('')
	const [location, setLocation] = useState<LatLng>()
	const [currentLocation, setCurrentLocation] = useState<LatLng>()
	const [region, onRegionChange] = useState({
		latitude: 0,
		longitude: 0,
		latitudeDelta: 0,
		longitudeDelta: 0,
	})
	const [pressed, setPressed] = useState(false)
	const navigation = useNavigation()
	const map = createRef()
	const marker = createRef()

	const getJWT = async () => {
		const jwt = await AsyncStorage.getItem('userJWT')
		if (jwt) {
			setJWT(jwt)
		}
	}

	const getLocation = async () => {
		const hasPermission = await hasLocationPermission()

		if (!hasPermission) {
			return
		}

		Geolocation.getCurrentPosition(
			(position) => {
				setCurrentLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				})
				onRegionChange({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001,
				})
			},
			(error) => {
				Alert.alert(`Code ${error.code}`, error.message)
				console.log(error)
			},
			{
				accuracy: {
					android: 'high',
					ios: 'best',
				},
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 10000,
				distanceFilter: 0,
				forceRequestLocation: true,
				showLocationDialog: true,
			},
		)
	}

	useEffect(() => {
		getJWT()
		getLocation()
	}, [])

	if (!currentLocation) {
		return <Loading />
	}

	const onButtonClick = () => {
		setPressed(true)
		const finalLocation: LatLng = location ? location : currentLocation
		fetch(`http://34.122.11.191:8090/landrecord?lat=${finalLocation.latitude}&lon=${finalLocation.longitude}`, {
			headers: {
				Authorization: `Bearer ${JWT}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					data.data.points = data.data.points.map((point: { lat: string; lon: string }) => {
						return {
							latitude: parseFloat(point.lat),
							longitude: parseFloat(point.lon),
						}
					})
					const landData = {
						...data.data,
						location: finalLocation,
					}
					setPressed(false)
					navigation.navigate('Payment', { ...landData })
				} else {
					if (Platform.OS === 'ios') {
						Alert.alert(JSON.stringify(data))
					} else {
						ToastAndroid.show(JSON.stringify(data), ToastAndroid.LONG)
					}
					setPressed(false)
				}
			})
			.catch((err) => {
				if (Platform.OS === 'ios') {
					Alert.alert(JSON.stringify(err))
				} else {
					ToastAndroid.show(JSON.stringify(err), ToastAndroid.LONG)
				}
				setPressed(false)
			})
	}

	return (
		<View style={styles.mainContainer}>
			<MapView style={styles.map} initialRegion={region} provider={PROVIDER_GOOGLE} showsUserLocation ref={map}>
				<Marker
					draggable
					coordinate={location ? location : currentLocation}
					ref={marker}
					onDragEnd={(e) => {
						setLocation(e.nativeEvent.coordinate)
					}}
				/>
			</MapView>
			<View
				style={{
					position: 'absolute',
					top: height * 0.875 - 55,
					left: width - 55,
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<TouchableWithoutFeedback
					onPress={() => {
						marker.current.animateMarkerToCoordinate(currentLocation)
						map.current.animateToRegion(
							{
								latitude: currentLocation.latitude,
								longitude: currentLocation.longitude,
								latitudeDelta: 0.001,
								longitudeDelta: 0.001,
							},
							500,
						)
						setLocation(currentLocation)
					}}>
					<Image
						source={require('./images/mylocation.png')}
						style={{
							width: 50,
							height: 50,
						}}
					/>
				</TouchableWithoutFeedback>
			</View>
			<View
				style={{
					position: 'absolute',
					top: height * 0.875,
					left: width * 0.05,
				}}>
				<TouchableWithoutFeedback
					style={[styles.containerTouchableOpacity, { backgroundColor: '#2CB9B0' }]}
					onPress={pressed ? () => true : onButtonClick}>
					{pressed ? <ActivityIndicator color="white" /> : <Text style={[styles.label, { color: '#fff' }]}>Submit</Text>}
				</TouchableWithoutFeedback>
			</View>
		</View>
	)
}

export default LocationComponent
