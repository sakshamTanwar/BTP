/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler'

import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { LocationComponent } from './src'

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: Colors.lighter,
	},
})

const App = () => {
	return (
		<NavigationContainer>
			<StatusBar barStyle="dark-content" />
			<SafeAreaView>
				<ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
					<LocationComponent />
				</ScrollView>
			</SafeAreaView>
		</NavigationContainer>
	)
}

export default App
