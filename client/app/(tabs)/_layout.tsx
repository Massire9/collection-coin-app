import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://192.168.1.27:3000/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: "blue",
              headerShown: false,
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "My coins",
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="money" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="add-coin"
              options={{
                title: "Add",
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="plus-circle" color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="two"
              options={{
                title: "Graph",
                tabBarIcon: ({ color }) => (
                  <TabBarIcon name="bar-chart" color={color} />
                ),
              }}
            />
          </Tabs>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
