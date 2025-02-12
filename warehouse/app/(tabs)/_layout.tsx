import { Tabs } from "expo-router"
import { Home, BarChart2, Package } from "lucide-react-native"

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistiques",
          tabBarIcon: ({ color }) => <BarChart2 color={color} />,
        }}
      />
      <Tabs.Screen
      name="product-list"
      options={{
          title: "Produits",
          tabBarIcon: ({ color }) => <Package color={color} />,
        }}
      />
    </Tabs>
  )
}
