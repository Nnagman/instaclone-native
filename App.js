import AppLoading from "expo-app-loading";
import React, {useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import * as Font from "expo-font";
import {Asset} from "expo-asset";
import LoggedOutNav from "./navigators/LoggedOutNav";
import {NavigationContainer} from "@react-navigation/native";
import {ApolloProvider, useReactiveVar} from "@apollo/client";
import client, {isLoggedInVar, tokenVar, cache} from "./apollo";
import LoggedInNav from "./navigators/LoggedInNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AsyncStorageWrapper, persistCache} from "apollo3-cache-persist";

export default function App() {
    const [loading, setLoading] = useState(true);
    const onFinish = () => setLoading(false);
    const isLoggedIn = useReactiveVar(isLoggedInVar);
    const preloadAssets = () => {
        const fontsToLoad = [Ionicons.font];
        const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
        const imagesToLoad = [require("./assets/logo.png")];
        const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
        return Promise.all([...fontPromises, ...imagePromises]);
    };
    const preload = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            isLoggedInVar(true);
            tokenVar(token);
        }
        await persistCache({
            cache,
            storage: new AsyncStorageWrapper(AsyncStorage),
            /*
                TIP) 왜 serialize 했느냐? 쿼리가 변경되면 cache 의 내용과 충돌하는데,
                아래의 serialize 를 false 하면 에러가 해결
             */
            serialize: false,
        });
        return preloadAssets();
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
        <ApolloProvider client={client}>
            <NavigationContainer>
                {isLoggedIn ? <LoggedInNav/> : <LoggedOutNav/>}
            </NavigationContainer>
        </ApolloProvider>
    );
}