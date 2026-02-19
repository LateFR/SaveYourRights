import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { useTheme } from '@/hooks/useTheme'
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const theme = useTheme()
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabBar.active,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar.background,
          borderTopColor: theme.tabBar.border,
          height: 50,
        },
        sceneStyle: {
          backgroundColor: theme.background
        }
      }}
    >
      <Tabs.Screen
        name='network'
        options={{
          title: "",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => focused 
          ? (<MaterialCommunityIcons name="message" size={28} color={color} />)
          : (<Feather name="message-square" size={28} color={color} />)
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? "home" : "home-outline"} color={color} size={34} />
          ),
        }}
      />


      <Tabs.Screen
        name="two"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => focused 
            ? <Ionicons name="shield" size={28} color={color} />
            : <Ionicons name="shield-outline" size={28} color={color} />
          ,
        }}
      />

      <Tabs.Screen
        name='parameters'
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Feather name="menu" size={28} color={color} />
          )
        }}
      />
    </Tabs>
  )
}
