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

import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { LocationComponent, LoginComponent } from './src'

type RouteType = {
	Login: undefined
	Location: undefined
}

const Stack = createStackNavigator<RouteType>()

const App = () => {
	return (
		<NavigationContainer>
			<StatusBar barStyle="dark-content" />
			<SafeAreaProvider>
				<Stack.Navigator initialRouteName="Login" headerMode="none">
					<Stack.Screen name="Login" component={LoginComponent} />
					<Stack.Screen name="Location" component={LocationComponent} />
				</Stack.Navigator>
			</SafeAreaProvider>
		</NavigationContainer>
	)
}

export default App
