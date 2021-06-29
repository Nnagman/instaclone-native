import AppLoading from "expo-app-loading";
import React, {useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import * as Font from "expo-font";
import LoggedOutNav from "./navigators/LoggedOutNav";
import {NavigationContainer} from "@react-navigation/native";

export default function App() {
    const [loading, setLoading] = useState(true);
    const onFinish = () => setLoading(false);
    const preload = () => {
        const fontsToLoad = [Ionicons.font];
        const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
        return Promise.all(fontPromises);
    };
    if (loading) {
        return (
            <AppLoading
                startAsync={preload}
                onError={console.warn}
                onFinish={onFinish}
            />
        );
    }
    return (
        <NavigationContainer>
            <LoggedOutNav/>
        </NavigationContainer>
    );
}