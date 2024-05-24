import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { Button, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/Input";
import { trpc } from "@/lib/trpc";
import Toast from "react-native-toast-message";
import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import axios from "axios";

export type CoinForm = {
  name: string;
  rarity: string;
  value: string;
  quantity: string;
};

const addCoin = () => {
  const utils = trpc.useUtils();
  const camera: LegacyRef<CameraView> = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CoinForm>({
    defaultValues: {
      name: "",
      rarity: "",
      value: "",
      quantity: "",
    },
  });
  const [facing, setFacing] = useState<"back" | "front">("front");
  const [displayCam, setDisplayCam] = useState(false);
  const [ready, setReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | undefined>("");
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    requestPermission()
  }, [permission]);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const snap = async () => {
    try {
      console.log(permission?.granted);
      const image = await camera.current?.takePictureAsync({
        base64: true,
      });
      console.log(image);

      if (image) {
        setImage(() => image.base64);
      }
      setDisplayCam(false);
    } catch (err) {
      console.log(err);
    }
  };

  const { mutateAsync: create } = trpc.coins.create.useMutation({
    onSuccess: () => {
      if (image) {
        const bs = atob(image);
        const buffer = new ArrayBuffer(bs.length);
        const ba = new Uint8Array(buffer);
        for (let i = 0; i < bs.length; i++) {
          ba[i] = bs.charCodeAt(i);
        }
        const file = new Blob([ba], { type: "image/png" });
        const formData = new FormData();

        formData.append("file", file);
        const res = axios.post(
          "http://192.168.1.27:3000//api/image/add/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res);
      }
      utils.coins.get.invalidate();
      Toast.show({
        type: "success",
        text1: "Belle trouvaille !",
        text2: "Votre pièce a bien été enregistré !",
      });
    },
  });

  const onSubmit = async (data: CoinForm) => {
    const coin = await create({
      name: data.name,
      year: new Date().getFullYear(),
      quantity: parseInt(data.quantity),
      value: parseInt(data.value),
      rarity: data.rarity,
    });
    console.log(coin);

    setId(() => coin.id);
  };

  if (displayCam) {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={camera}
          onCameraReady={() => setReady(true)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={snap}>
              <Text style={styles.text}>Snap</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setDisplayCam(false)}
            >
              <Text style={styles.text}>Exit</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View>
      <Input name="name" placeholder="Name" control={control} errors={errors} />
      <Input
        name="value"
        placeholder="Value"
        control={control}
        errors={errors}
      />
      <Input
        name="quantity"
        placeholder="Quantity"
        control={control}
        errors={errors}
      />
      <Input
        name="rarity"
        placeholder="Rarity"
        control={control}
        errors={errors}
      />

      {permission?.granted && (
        <Button title="Add a picture" onPress={() => setDisplayCam(true)} />
      )}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default addCoin;
