
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const navigate = useRouter().push;
  
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl text-accent font-bold">Shop Floor Lite!!</Text>
      <Pressable className="p-4 "
        onPress={() => {
          navigate("/login");
        }}
      >
        <Text>login</Text>
      </Pressable>

      <Pressable className="p-4 "
        onPress={() => {
          navigate("/signup");
        }}
      >
        <Text>signup</Text>
      </Pressable>
    </View>
  );
}
