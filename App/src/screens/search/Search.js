import {
  View,
  Text,
  TextInput,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap } from "react-native-tab-view";
import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore/lite";
import { auth, database, db } from "../../security/firebase";
import { push, ref } from "firebase/database";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = (props) => {
  return (
    <View className="flex flex-row">
      <TouchableOpacity
        className={
          props.navigationState.index == 0
            ? "flex-1  border-b border-b-gray-400 pb-3"
            : "flex-1 pb-3"
        }
        onPress={() => {
          props.jumpTo("first");
        }}
      >
        <Text className="text-center">People</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={
          props.navigationState.index == 1
            ? "flex-1  border-b border-b-gray-400 pb-3"
            : "flex-1 pb-3"
        }
        onPress={() => {
          props.jumpTo("second");
        }}
      >
        <Text className="text-center">Group</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={
          props.navigationState.index == 2
            ? "flex-1  border-b border-b-gray-400 pb-3"
            : "flex-1 pb-3"
        }
        onPress={() => {
          props.jumpTo("third");
        }}
      >
        <Text className="text-center">Challenges</Text>
      </TouchableOpacity>
    </View>
  );
};

const Search = ({ navigation }) => {
  const layout = useWindowDimensions();

  const [searchedData, setSearchedData] = React.useState([]);
  const [searchedGroupData, setSearchedGroupData] = React.useState([]);
  const [searchedChallengeData, setChallengeData] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "First" },
    { key: "second", title: "Second" },
    { key: "third", title: "Third" },
  ]);
  const searchInfo = async (txt, ivalue) => {
    if (txt != "" && ivalue == 0) {
      const ref1 = collection(db, "user");
      const q = query(ref1, orderBy("name"));
      const q2 = query(q, startAt(txt));
      const q3 = query(q2, endAt(txt + "\uf8ff"));
      const snap = await getDocs(q3);
      const arr = [];
      snap.forEach(async (docs) => {
        if (docs.data()["email"] != auth.currentUser.email) {
          arr.push([docs.id, docs.data()]);
        }
      });
      const arr2 = [];
      const arr3 = [];
      for (var i = 0; i < arr.length; i++) {
        const d1 = arr[i];
        var id = "";
        const ref2 = collection(db, "chat");
        const ref3 = query(
          ref2,
          where("user", "in", [
            [d1[0], auth.currentUser.uid],
            [auth.currentUser.uid, d1[0]],
          ])
        );
        const snapshot = await getDocs(ref3);
        if (snapshot.size == 0) {
          id = push(ref(database, "chat")).key;
        } else {
          snapshot.forEach((datas) => {
            id = datas.id;
          });
        }
        arr3.push([d1[0], d1[1], id]);
      }
      setSearchedData(arr3);
    }
    if (txt != "" && ivalue == 1) {
      const ref1 = collection(db, "group");
      const q = query(ref1, orderBy("name"));
      const q2 = query(q, startAt(txt));
      const q3 = query(q2, endAt(txt + "\uf8ff"));
      const snap = await getDocs(q3);
      const arr = [];
      snap.forEach(async (docs) => {
        arr.push([docs.id, docs.data()]);
      });
      setSearchedGroupData(arr);
    }
    if (txt != "" && ivalue == 2) {
      const ref1 = collection(db, "challenges");
      const q = query(ref1, orderBy("taskTitle"));
      const q2 = query(q, startAt(txt));
      const q3 = query(q2, endAt(txt + "\uf8ff"));
      const snap = await getDocs(q3);
      const arr = [];
      snap.forEach(async (docs) => {
        arr.push([docs.id, docs.data()]);
      });
      setChallengeData(arr);
    }
  };
  const FirstRoute = () => {
    return (
      <View className="flex-1 mt-1">
        {searchedData.map((docs) => {
          return <SearchDataView data={docs} />;
        })}
      </View>
    );
  };

  const SecondRoute = () => {
    return (
      <View className="flex-1 mt-1">
        {searchedGroupData.map((docs) => {
          return <SearchGroupDataView data={docs} />;
        })}
      </View>
    );
  };
  const ThirdRoute = () => {
    return (
      <View className="flex-1 mt-1">
        {searchedChallengeData.map((docs) => {
          return <SearchChallengeDataView data={docs} />;
        })}
      </View>
    );
  };
  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  const SearchDataView = (data) => {
    return (
      <View className="border-b border-b-gray-50 p-3 py-4 pl-6 flex flex-row">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("VisitProfile", { data: data.data[0] })
          }
          className=" flex flex-row"
        >
          <Image
            source={{ uri: data.data[1].image }}
            className="h-12 w-12 rounded-full"
          />
          <View className="px-4">
            <Text className="font-bold" style={{ fontSize: 17 }}>
              {data.data[1].name}
            </Text>
            <Text className="text-gray-500" style={{ fontSize: 13 }}>
              {data.data[1].bio}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Chat", {
              data: data.data[1],
              chatId: data.data[2],
              uid: data.data[0],
            })
          }
          className="ml-auto my-auto mr-5"
        >
          <Icon name="chatbubble-ellipses-outline" size={20} color="#3880FF" />
        </TouchableOpacity>
      </View>
    );
  };
  const SearchGroupDataView = (data) => {
    return (
      <View className="border-b border-b-gray-50 p-3 py-4 pl-6 flex flex-row">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("GroupRouter", { data: data.data })
          }
          className=" flex flex-row"
        >
          <Image
            source={{ uri: data.data[1]["frontImage"] }}
            className="h-12 w-12 rounded-full"
          />
          <View className="px-4">
            <Text className="font-bold" style={{ fontSize: 17 }}>
              {data.data[1].name}
            </Text>
            <Text className="text-gray-500" style={{ fontSize: 13 }}>
              {data.data[1].description}
            </Text>
          </View>
        </TouchableOpacity>
        {data.data[1].followerList ? (
          <>
            {data.data[1].followerList.includes(auth.currentUser.uid) && (
              <TouchableOpacity className="ml-auto my-auto mr-5">
                <Icon name="checkbox" size={24} color="#3880FF" />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    );
  };
  const SearchChallengeDataView = (data) => {
    return (
      <View className="border-b border-b-gray-100 p-3 py-4 pl-6 flex flex-row">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Post", data.data)}
          className=" flex flex-row"
        >
          <Image
            source={{ uri: data.data[1]["image"] }}
            className="h-14 w-14 rounded-full"
          />
          <View className="px-4">
            <Text className="font-bold" style={{ fontSize: 22 }}>
              {data.data[1].taskTitle}
            </Text>

            <View
              className="mt-2 flex flex-row rounded"
              style={{ alignSelf: "flex-start" }}
            >
              <View className="flex flex-row space-x-2">
                <View
                  className=" flex flex-row rounded bg-gray-100 p-1 px-3 space-x-3 "
                  style={{ alignSelf: "flex-start" }}
                >
                  <Icon name="people" color="#0073B0" size={16} />
                  <Text>{data.data[1].followers}</Text>
                </View>
                <View
                  className=" flex flex-row rounded bg-gray-100 p-1 px-3 space-x-3 "
                  style={{ alignSelf: "flex-start" }}
                >
                  <Icon name="heart" color="#E9476A" size={16} />
                  <Text>{data.data[1].followers}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {data.data[1].followerList ? (
          <>
            {data.data[1].followerList.includes(auth.currentUser.uid) && (
              <TouchableOpacity className="ml-auto my-auto mr-5">
                <Icon name="checkbox" size={24} color="#3880FF" />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-5">
        <View className="flex flex-row space-x-5">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.goBack()}
            style={{ marginTop: "auto", marginBottom: "auto" }}
          >
            <Icon name="chevron-back" size={26} color="#000" />
          </TouchableOpacity>
          <Text className="font-bold text-3xl">Search</Text>
        </View>
        <TextInput
          value={searchText}
          onChangeText={(txt) => {
            setSearchText(txt);
            searchInfo(txt, index);
          }}
          placeholder="Search"
          className="bg-gray-200 p-3 rounded-xl mt-4"
        />
      </View>
      <TabView
        renderTabBar={(props) => Tab(props, searchInfo, searchText)}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(i) => {
          setIndex(i);
          searchInfo(searchText, i);
        }}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
};

export default Search;
