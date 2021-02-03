import { Alert, Button, Linking, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'

import Geolocation from 'react-native-geolocation-service'

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	contentContainer: {
		padding: 12,
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: 12,
	},
	result: {
		borderWidth: 1,
		borderColor: '#666',
		width: '100%',
		padding: 10,
	},
	buttonContainer: {
		alignItems: 'center',
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginVertical: 12,
		width: '100%',
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
		Alert.alert(`Turn on Location Services to determine your location.`, '', [
			{ text: 'Go to Settings', onPress: openSetting },
			{ text: "Don't Use Location", onPress: () => {} },
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
	const [location, setLocation] = useState<Geolocation.GeoPosition | null>(null)

	const getLocation = async () => {
		const hasPermission = await hasLocationPermission()

		if (!hasPermission) {
			return
		}

		Geolocation.getCurrentPosition(
			(position) => {
				setLocation(position)
				console.log(position)
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

	return (
		<View style={styles.mainContainer}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View style={styles.buttonContainer}>
					<Button title="Get Location" onPress={getLocation} />
				</View>
				<View style={styles.result}>
					<Text>Latitude: {location?.coords?.latitude || ''}</Text>
					<Text>Longitude: {location?.coords?.longitude || ''}</Text>
					<Text>Heading: {location?.coords?.heading}</Text>
					<Text>Accuracy: {location?.coords?.accuracy}</Text>
					<Text>Altitude: {location?.coords?.altitude}</Text>
					<Text>Speed: {location?.coords?.speed}</Text>
					<Text>Timestamp: {location?.timestamp ? new Date(location.timestamp).toLocaleString() : ''}</Text>
				</View>
			</ScrollView>
		</View>
	)
}

export default LocationComponent
