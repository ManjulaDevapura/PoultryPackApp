import React , { useRef, useState, useEffect } from "react";
import { SafeAreaView, AppState, ToastAndroid, FlatList, View, StyleSheet, StatusBar, Text, TouchableOpacity, Modal, Image, TextInput, Button, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { TabView, SceneMap } from 'react-native-tab-view';

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

const DATA = [
  {
    id: '1',
    title: 'First Item',
    position : 0
  },
  {
    id: '2',
    title: 'Second Item',
    position : 1
  },
  {
    id: '3',
    title: 'Third Item',
    position : 2
  },
  {
    id: '4',
    title: 'four',
    position : 3
  },
  {
    id: '5',
    title: 'five',
    position : 4
  },
  {
    id: '6',
    title: 'six',
    position : 5
  },
  {
    id: '7',
    title: 'seven',
    position : 6
  },
  {
    id: '8',
    title: 'seven',
    position : 7
  },
];

const Item = ({ item, onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.title}</Text>
  </TouchableOpacity>
);



export default function App() {

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? '#f9c2ff' : '#f9c2ff';
    
    // modalView()
    return <Item item={item} onPress={() => setData(item)} style={{ backgroundColor }} />;
  };

  const SecondRoute = () => (
    <SafeAreaView style={styles.container}>
        <FlatList data={DATA} renderItem={renderItem} keyExtractor={item => item.id} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            console.log('hi')
          }}>
          <View style={{
                flex: 1,
                backgroundColor: 'white',
            }}>
            <View style={{
                height: 50,
                backgroundColor: "#fff",
                justifyContent: "center",
                marginRight: 1,
                marginTop: '4%',
                marginLeft: -5,
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: 'red'
            }}>
            <TextInput
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    color: "#696969",
                    height: 38,
                    padding: 0,
                    paddingLeft: 10,
                    flex: 1,
                    paddingBottom: 8
                }}
                  placeholder={"Rename Here"}
                  maxLength={12}
                  onChangeText={value =>
                    rename(value)
            }/>
  
                <TouchableOpacity
                      onPress={() => setModalVisible(false)}>
                    <View style={{
                                height: 35,
                                width: 60,
                                backgroundColor: 'transparent',
                                flex: 1,
                                alignItems: 'center',
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                                marginRight: 10
                            }}>
                          <Image
                              resizeMode={'contain'}
                              source={require('./assets/done.png')}
                              style={{
                                height: 24,
                                width: 24,
                                marginTop: 5
                            }}
                          />
                      </View>
                </TouchableOpacity>
            </View>
            <Text numberOfLines={1} ellipsizeMode='tail' 
                    style={{
                    fontSize: 16,
                    color: "#696969",
                    marginLeft: "1%",
                    paddingTop: 2,
                    paddingBottom: 2,
                    fontWeight: '500',
                    width: 300
                }}>{ selectedItem !=null ? "Original Name : "+selectedItem.title : ""}
              </Text>
        </View>
    </Modal>
      </SafeAreaView>
  );
  
  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

const activeNotifier = () => {
  axios.get("https://reqres.in/api/users/2")
      .then(response => {
          console.log('************ activeNotifier **********', response.data);
          ToastAndroid.show('activeNotifier', ToastAndroid.SHORT);
      })
      .catch(error => {
          console.log(error);
      });
}

const setData = (item) => {
  setSelectedItem(item)
  setModalVisible(true)
}

const backgroundNotifier = () => {
  axios.get("https://reqres.in/api/users/2")
      .then(response => {
          console.log('************* backgroundNotifier ************', response.data);
          ToastAndroid.show('backgroundNotifier', ToastAndroid.SHORT);
      })
      .catch(error => {
          console.log(error);
      });
}


const rename = (value) => {
  selectedItem.title = value
  setSelectedItem(selectedItem)
  DATA[selectedItem.position] = selectedItem
}

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      activeNotifier()
    } else {
      console.log('App has come to the background!');
      backgroundNotifier()
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
