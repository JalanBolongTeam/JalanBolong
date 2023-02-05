/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme, ScrollView, Easing
} from 'react-native';

import Splash from './page/Splash';
import Login from './page/Login';
import Register from './page/Register';
import Home from './page/Home';
import DetailHome from './page/DetailHome';
import AddLocation from './page/AddLocation';
import Profil from './page/Profil';
import ListMap from './page/ListMap';
import DetailMapList from './page/DetailMapList';
import MapPopUp from './page/MapPopUp';

import Tab from './bottomTab/Tab';
import Colors from './constants/Colors';


import { Provider } from 'react-native-paper';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
  };

  return (
    <Provider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={Colors.white} />
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
};

const openConfig = {
  animation: 'spring',
  config: {
    stiffness: 200,
    damping: 35,
    mass: 5,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  }
}

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 200,
    easing: Easing.linear,
  }
}

const options = {
  gestureEnabled: true,
  gestureDirection: 'horizontal-inverted',
  cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
  headerShown: false,
  // transitionSpec: {
  //   open: openConfig,
  //   close: closeConfig,
  // },
}

const Stack = createSharedElementStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={options} >


      <Stack.Screen name="Splash" component={Splash} />

      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />

      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddLocation" component={AddLocation} />
      <Stack.Screen name="DetailHome" component={DetailHome} />
      <Stack.Screen name="Profil" component={Profil} />

      <Stack.Screen name="ListMap" component={ListMap} options={{ headerShown: false }} />
      <Stack.Screen name="DetailMapList" component={DetailMapList} />
      <Stack.Screen name="MapPopUp" component={MapPopUp} />

      <Stack.Screen name="Tab" component={Tab} />
    </Stack.Navigator>
  )
}

export default App;
