/* eslint-disable no-nested-ternary */
import * as Yup from 'yup'

import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'

import { Formik } from 'formik'
import Icon from 'react-native-vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native'

const { height } = Dimensions.get('window')

const LoginSchema = Yup.object().shape({
	password: Yup.string().min(6, 'Too Short!').max(20, 'Too Long!').required('Required'),
	email: Yup.string().email('Invalid email').required('Required'),
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height,
		backgroundColor: 'white',
	},
	imageContainer: {
		borderBottomLeftRadius: 75,
		// borderBottomRightRadius: 75,
		overflow: 'hidden',
		height: height * 0.2,
	},
	middle: {
		flex: 1,
		padding: 30,
	},
	subTitle: {
		fontSize: 28,
		lineHeight: 30,
		marginBottom: 20,
		color: '#0C0D34',
		textAlign: 'center',
	},
	description: {
		fontSize: 19,
		lineHeight: 24,
		color: 'grey',
		textAlign: 'center',
		marginBottom: 40,
	},
	textinputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 48,
		borderRadius: 10,
		borderWidth: StyleSheet.hairlineWidth,
		marginBottom: 10,
	},
	validationOutput: {
		height: 20,
		width: 20,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
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

const Login = () => {
	const passwordRef = useRef<TextInput>(null)
	const [isLoggingIn, setIsLoggingIn] = useState(false)
	const navigation = useNavigation()
	return (
		<View style={styles.container}>
			<KeyboardAwareScrollView extraHeight={40} enableOnAndroid={true} style={{ paddingBottom: 0, marginBottom: 0 }}>
				<View style={styles.imageContainer} />
				<View style={styles.middle}>
					<Text style={styles.subTitle}>Welcome Back</Text>
					<Text style={styles.description}>Use your credentials below and login to your account</Text>
					<Formik
						initialValues={{ email: '', password: '' }}
						validationSchema={LoginSchema}
						onSubmit={(values) => {
							console.log(values)
							setIsLoggingIn(true)
							navigation.navigate('Location')
						}}>
						{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
							const colorEmail = !touched.email ? 'grey' : !errors.email ? '#2CB9B0' : 'red'
							const colorPassword = !touched.password ? 'grey' : !errors.password ? '#2CB9B0' : 'red'
							return (
								<View>
									<View style={[styles.textinputContainer, { borderColor: colorEmail }]}>
										<View style={{ padding: 20 }}>
											<Icon name="mail" color={colorEmail} size={16} style={{ height: 16 }} />
										</View>
										<View style={{ flex: 1 }}>
											<TextInput
												underlineColorAndroid="transparent"
												onChangeText={handleChange('email')}
												onBlur={handleBlur('email')}
												value={values.email}
												placeholder="Enter your Email"
												placeholderTextColor={colorEmail}
												textContentType="emailAddress"
												autoCompleteType="email"
												returnKeyType="next"
												returnKeyLabel="next"
												onSubmitEditing={() => passwordRef.current?.focus()}
											/>
										</View>
										{touched.email && (
											<View style={[styles.validationOutput, { backgroundColor: colorEmail }]}>
												<Icon name={!errors.email ? 'check' : 'x'} size={16} color="white" style={{ height: 16 }} />
											</View>
										)}
									</View>

									<View style={[styles.textinputContainer, { borderColor: colorPassword }]}>
										<View style={{ padding: 20 }}>
											<Icon name="lock" color={colorPassword} size={16} style={{ height: 16 }} />
										</View>
										<View style={{ flex: 1 }}>
											<TextInput
												ref={passwordRef}
												underlineColorAndroid="transparent"
												onChangeText={handleChange('password')}
												onBlur={handleBlur('password')}
												value={values.password}
												placeholder="Enter your password"
												placeholderTextColor={colorPassword}
												textContentType="password"
												secureTextEntry={true}
												autoCompleteType="password"
												returnKeyType="go"
												returnKeyLabel="go"
												onSubmitEditing={() => handleSubmit()}
											/>
										</View>
										{touched.password && (
											<View style={[styles.validationOutput, { backgroundColor: colorPassword }]}>
												<Icon
													name={!errors.password ? 'check' : 'x'}
													size={16}
													color="white"
													style={{ height: 16 }}
												/>
											</View>
										)}
									</View>

									<View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
										<TouchableOpacity
											style={[
												styles.containerTouchableOpacity,
												{ backgroundColor: isLoggingIn ? 'rgba(12, 13, 52, 0.05)' : '#2CB9B0' },
											]}
											onPress={isLoggingIn ? () => true : handleSubmit}>
											<Text style={[styles.label, { color: isLoggingIn ? '#0C0D34' : '#fff' }]}>
												Log into your account
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							)
						}}
					</Formik>
				</View>
			</KeyboardAwareScrollView>
		</View>
	)
}

export default Login