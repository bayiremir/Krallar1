import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Pressable,
} from "react-native";
import dateformat from "dateformat";
import { useGetMostReadQuery } from "../../redux/slices/authSlices";
import { useNavigation } from "@react-navigation/native";
import { settings } from "../../utils/settings";

const AdultPsychiatry = () => {
  const [isAlternateLayout, setIsAlternateLayout] = useState(false);
  const navigation = useNavigation();
  const animation = useRef(null);
  const handleViewAllPress = () => {
    Linking.openURL("https://e-psikiyatri.com/eriskin-psikiyatri");
  };

  const { data, isLoading, isError } = useGetMostReadQuery();

  const mostRead = data ? data.contents : [];

  const handleItemPress = (slug) => {
    const cleanSlug = slug.replace("https://e-psikiyatri.com/", "");
    navigation.navigate("ContentScreen", { slug: cleanSlug });
  };

  const renderMostReadItem = ({ item }) => {
    const formattedDate = dateformat(item.updated_at, "dd/mm/yyyy");

    if (isAlternateLayout) {
      return (
        <View>
          <Pressable
            onPress={() => handleItemPress(item.slug)}
            style={
              isAlternateLayout
                ? styles.alternatePressableContainer
                : styles.pressableContainer
            }
          >
            {isAlternateLayout ? (
              <>
                <Text style={styles.alternateTitleText}>{item.title}</Text>
                <Image
                  source={{ uri: item.image }}
                  style={styles.alternateImage}
                />
              </>
            ) : (
              <View style={styles.mostReadItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.mostReadImage}
                />
                <Text style={styles.titleBottomText}>{item.title}</Text>
              </View>
            )}
          </Pressable>
          <View style={styles.divider}></View>
        </View>
      );
    }

    return (
      <Pressable
        onPress={() => handleItemPress(item.slug)}
        style={styles.pressableContainer} // Ekledim
      >
        <View style={styles.mostReadItem}>
          <Image source={{ uri: item.image }} style={styles.mostReadImage} />
          <Text style={styles.titleBottomText}>{item.title}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <View style={{ marginHorizontal: 0 }}>
          <View style={styles.featuredNewsContainer}>
            <View style={styles.featuredNewsTextContainer}>
              <View style={styles.featuredNewsWithIcon}>
                <Text style={styles.featuredNewsText}>
                  Erişkin Psikiyatrisi
                </Text>
                {isAlternateLayout ? (
                  <View
                    style={styles.listIcon}
                    size={24}
                    color="black"
                    onPress={() => setIsAlternateLayout(!isAlternateLayout)}
                  />
                ) : (
                  
                  <View
                    style={styles.listIcon}
                    name="list"
                    size={24}
                    color="black"
                    onPress={() => setIsAlternateLayout(!isAlternateLayout)}
                  />
                )}
              </View>
              <View style={styles.featuredNewsLine}></View>
            </View>
          </View>
          <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ width: "auto" }}
          >
            {mostRead.map((item, index) => (
              <View key={index.toString()} style={{ overflow: "hidden" }}>
                {renderMostReadItem({ item })}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mostReadImage: {
    resizeMode:"contain",
    width: 400,
    margin: 10,
    height: 250,
  },
  mostReadItem: {
    alignItems: "center",
  },
  featuredNewsContainer: {
    marginBottom: 10,
  },
  featuredNewsTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
    backgroundColor: "rgba(64,183,176,0.3)",
  },
  featuredNewsWithIcon: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%", 
  },
  featuredNewsText: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10,
    color: "#ec5051",
  },
  listIcon: {
    position: "absolute",
    right: 20,
    top: 10,
  },
  featuredNewsLine: {
    height: 3,
    width: "32%",
    backgroundColor: "#952323",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 5,
  },
  pressableContainer: {
    backgroundColor: "white",
    width: "100%",
    height: settings.CARD_WIDTH * 1.60,
    marginBottom: 10,
  },
  alternatePressableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  alternateImage: {
    width: 150,
    height: 100,
    marginRight: 10,
  },
  alternateTitleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  divider: {
    height: 0.3,
    backgroundColor: "grey",
    width: "100%", // to make sure it takes the full width
  },
  titleBottomText: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 20,
  },
});

export default AdultPsychiatry;
