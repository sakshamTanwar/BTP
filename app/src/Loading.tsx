import { ActivityIndicator, Dimensions, View } from 'react-native'

import React from 'react'

const { width, height } = Dimensions.get('window')

const Loading = () => {
	return (
		<View style={{ justifyContent: 'center', alignItems: 'center', width, height }}>
			<ActivityIndicator color="black" size="large" />
		</View>
	)
}

export default Loading
