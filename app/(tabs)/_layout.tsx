// app/(tabs)/_layout.tsx
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'
import { useTheme } from '@/hooks/useTheme'
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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
          tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Entypo name="home" color={color} size={28} />
          ),
        }}
      />


      <Tabs.Screen
        name="two"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="shield" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
