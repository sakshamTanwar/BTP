import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'

import { LatLng } from 'react-native-maps'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native'

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
})

interface Data {
	khasra: string
	village: string
	subDistrict: string
	district: string
	state: string
	location: LatLng
}

const Payment = () => {
	const route = useRoute()
	const data = route.params as Data
	// const [data, setData] = useState<Data>()

	// const getData = async () => {
	// 	const landData = await AsyncStorage.getItem('landData')
	// 	if (landData) {
	// 		setData(JSON.parse(landData))
	// 	}
	// }

	// useEffect(() => {
	// 	getData()
	// }, [])

	if (!data) {
		return <ActivityIndicator />
	}

	return (
		<View style={styles.mainContainer}>
			<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
				<View style={styles.result}>
					<Text>Latitude: {data.location.latitude}</Text>
					<Text>Longitude: {data.location.longitude}</Text>
					<Text>Khasra No: {data.khasra}</Text>
					<Text>Village: {data.village}</Text>
					<Text>Sub District: {data.subDistrict}</Text>
					<Text>District: {data.district}</Text>
					<Text>State: {data.state}</Text>
				</View>
				<View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
					<TouchableOpacity style={[styles.containerTouchableOpacity, { backgroundColor: '#2CB9B0' }]} onPress={() => true}>
						<Text style={[styles.label, { color: '#fff' }]}>Continue with Payment</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	)
}

export default Payment
