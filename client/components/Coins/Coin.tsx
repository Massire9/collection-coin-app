import React, { useCallback, useMemo, useRef } from "react";
import type { Coins } from "../../../server/src/lib/prisma";
import { GestureResponderEvent, Pressable, Text, View } from "react-native";
import tw from "twrnc";
import { FontAwesome5 } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const Coin = ({ coin, onPress }: { coin: Coins, onPress: (event: GestureResponderEvent) => void }) => {

  return (
    <Pressable
    onPress={onPress}
      style={tw`flex border-b-2 border-black p-4 flex-row justify-between`}
    >
      <View>
        <Text style={tw`text-xl font-bold`}>{coin.name}</Text>
      </View>
      <View>
        <Text style={tw`text-xl`}>{coin.value}$</Text>
      </View>
    </Pressable>
  );
};

export default Coin;
