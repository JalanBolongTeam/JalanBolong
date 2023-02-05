import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated } from 'react-native'
import Icon, { Icons } from '../components/Icons';
import Screen from '../screen/Screen';
import Colors from '../constants/Colors';
import ListMap from '../page/ListMap';
import Profil from '../page/Profil';
import Home from '../page/Home'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



const TabArr = [
  { route: 'Home', label: 'Home', type: Icons.Ionicons, activeIcon: 'home', inActiveIcon: 'home-outline', component: Home, tabBarColor: "#595860"},
  { route: 'Explore', label: 'Explore', type: Icons.MaterialCommunityIcons, activeIcon: 'compass', inActiveIcon: 'compass-outline', component: ListMap, tabBarColor: "#595860" },
  { route: 'Account', label: 'Account', type: Icons.FontAwesome, activeIcon: 'user-circle', inActiveIcon: 'user-circle-o', component: Profil, tabBarColor: "#595860" },
];

const { width } = Dimensions.get('window');
const MARGIN = 16;
const TAB_BAR_WIDTH = width + 2 * MARGIN;
const TAB_WIDTH = TAB_BAR_WIDTH / TabArr.length;

function MyTabBar({ state, descriptors, navigation }) {
  const [translateX] = useState(new Animated.Value(0));

  const translateTab = (index) => {
    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    translateTab(state.index)
  }, [state.index])

  return (
    <View style={styles.tabBarContainer}>
      <Animated.View style={styles.slidingBarContainer}>
        <Animated.View
          style={[styles.slidingTab,
          { transform: [{ translateX }] },
          {backgroundColor:TabArr[state.index].tabBarColor} ]} />
      </Animated.View>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        console.log(options);
        const tabBarIcon = options.tabBarIcon;

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center' }}
            key={index}
          >
            <TabIcon
              tabIcon={tabBarIcon}
              isFocused={isFocused}
              // label={label}
              tabColor={options.tabColor}
              // index={state.index}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const TabIcon = ({ isFocused, tabIcon, label, tabColor }) => {
  const [translateY] = useState(new Animated.Value(0));

  const translateIcon = (val) => {
    Animated.spring(translateY, {
      toValue: val,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (isFocused) {
      translateIcon(-14)
    } else {
      translateIcon(10)
    }
  }, [isFocused])
  return (
    <>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Icon
          name={isFocused ? tabIcon.activeIcon : tabIcon.inActiveIcon}
          type={tabIcon.type}
          size={35}
          color={isFocused ? Colors.white : tabColor} />
      </Animated.View>
      <Text style={{ color: isFocused ? tabColor : Colors.darkGray }}>
        {label}
      </Text>
    </>
  )
}

const Tab = createBottomTabNavigator()

const Tab7 = (props) => {
  const username= props.route.params.username;
  const name= props.route.params.name;
  const no= props.route.params.no;
  const email= props.route.params.email;
  const image= props.route.params.image;

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <MyTabBar {...props} />}
    >
      {TabArr.map((_, index) => {
        return (
          <Tab.Screen key={index} name={_.route} component={_.component} 
          initialParams={{username, name, no, email, image}}
            options={{
              tabBarColor: _.tabBarColor,
              tabColor: _.tabBarColor,
              tabBarIcon: { activeIcon: _.activeIcon, inActiveIcon: _.inActiveIcon, type: _.type },
            }}
            />
        )
      })}
    </Tab.Navigator>


  )
}

export default Tab7

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    width: TAB_BAR_WIDTH,
    height: 60,
    position: 'absolute',
    alignSelf: 'center',
    bottom: MARGIN,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: -16,
  },
  slidingBarContainer: {
    width: TAB_WIDTH,
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  slidingTab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    bottom: 25,
    borderWidth: 4,
    borderColor: Colors.white,
  }
})