import { Modal, Pressable, StyleSheet, Text, View, Image } from "react-native";
import { trpc } from "@/lib/trpc";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Coin from "@/components/Coins/Coin";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import tw from "twrnc";
import type { Coins } from "../../../server/src/lib/prisma";

export default function TabOneScreen() {
  const {
    data: coins,
    isLoading,
    error,
    failureReason,
  } = trpc.coins.get.useQuery();

  const [selected, setSelected] = useState<number | null>();

  const onSelect = useCallback((index: number) => {
    setSelected(() => index);
  }, []);

  const onDeselect = useCallback(() => {
    setSelected(null);
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  if (coins) {
    return (
      <View style={tw`h-100`}>
        {coins.map((coin, index) => (
          <Coin coin={coin} key={coin.id} onPress={() => onSelect(index)} />
        ))}
        <Modal
          style={styles.modalView}
          animationType="slide"
          transparent={true}
          visible={selected != null}
        >
          <View style={styles.modalView}>
            {selected != null ? (
              <View style={tw`flex`}>
                <Text style={styles.modalText}>{coins[selected].name}</Text>
                <View style={styles.centeredView}>
                  <View>
                    { coins[selected].image.length > 0 && <Image source={{ uri: coins[selected].image[0].path }} />}
                    <Text><Text style={tw`font-bold`}>Quantity : </ Text>{coins[selected].quantity}</Text>
                    <Text><Text style={tw`font-bold`}>Rarity : </Text>{coins[selected].rariry}</Text>
                    <Text><Text style={tw`font-bold`}>Value : </Text>{coins[selected].value}</Text>
                    <Text><Text style={tw`font-bold`}>Acquisition Year : </Text>{coins[selected].year}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <Text>{selected}</Text>
            )}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => onDeselect()}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    marginTop: 80,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "80%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 15,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    paddingLeft: 5,
    paddingRight: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 19,
    fontWeight: "bold",
  },
});
