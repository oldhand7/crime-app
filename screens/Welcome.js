import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, theme } from "galio-framework";
import { useNavigation } from "@react-navigation/native";


const styles = StyleSheet.create({
  banner: {
    color: "#4A40E2",
    fontSize: 36,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 30,
    marginHorizontal: 'auto',
    fontWeight: 'bold'
  },
  getStart: {
    backgroundColor: 'blue',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
    margin: "auto",
    elevation: 10,
    marginTop: 30,
    marginBottom: 40
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
    paddingHorizontal: 50
  },
  scrollView: {
    paddingTop: 50,

  },
  pricingPlanContainer: {
    borderTopEndRadius: 40,
    borderBottomStartRadius: 40,
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 20,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  basicPlanContainer: {
    backgroundColor: 'white',
  },
  premiumPlanContainer: {
    backgroundColor: "#4A40E2",
  },
  ultimatePlanContainer: {
    backgroundColor: 'white',
  },
  pricingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#333",
    marginBottom: 10,
    marginTop: 30,
  },
  basicPlanTitle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  premiumPlanTitle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: '#ccc'
  },
  ultimatePlanTitle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  pricingPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    marginBottom: 30,

  },
  basicPlanPrice: {
    textAlign: 'center',
    color: '#4A40E2',
  },
  premiumPlanPrice: {
    textAlign: 'center',

    color: '#fff',
  },
  ultimatePlanPrice: {
    textAlign: 'center',

    color: '#4A40E2',
  },
  pricingFeaturesContainer: {
    marginTop: 10,
  },
  premiumFeature: {
    color: '#eee'
  },
  pricingFeature: {
    fontSize: 16,
    marginVertical: 10,
    color: 'grey',
  },
});


// Sample pricing data
const pricingData = [
  {
    title: 'FREE',
    price: '$0',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3'
    ],
    style: styles.basicPlanContainer,
    priceStyle: styles.basicPlanPrice,
    titleStyle: styles.basicPlanTitle,
    featureStyle: null

  },
  {
    title: 'Premium',
    price: '$19.99 / month',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
      'Feature 4',
      'Feature 5'
    ],
    style: styles.premiumPlanContainer,
    priceStyle: styles.premiumPlanPrice,
    titleStyle: styles.premiumPlanTitle,
    featureStyle: styles.premiumFeature
  },
  {
    title: 'Ultimate',
    price: '$29.99 / month',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
      'Feature 4',
      'Feature 5',
      'Feature 6',
      'Feature 7',
    ],
    featureStyle: null,

    style: styles.ultimatePlanContainer,
    priceStyle: styles.ultimatePlanPrice,
    titleStyle: styles.ultimatePlanTitle,
  },
];

const Welcome = () => {
  const navigation = useNavigation();


  const onPressStart = () => {
    navigation.navigate("Home")
  }

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} >
        <Text style={styles.banner}>Welcome to Crime APP</Text>
        {
          pricingData.map((pricingPlan, index) => (
            <View
              key={index}
              style={[
                styles.pricingPlanContainer,
                pricingPlan.style,
              ]}
            >
              <Text style={[styles.pricingTitle, pricingPlan.titleStyle]}>{pricingPlan.title}</Text>
              <Text style={[styles.pricingPrice, pricingPlan.priceStyle]}>{pricingPlan.price}</Text>
              <View style={styles.pricingFeaturesContainer}>
                {
                  pricingPlan.features.map((feature, index) => (
                    <Text key={index} style={[styles.pricingFeature, pricingPlan.featureStyle]}>{feature}</Text>
                  ))
                }
                <TouchableOpacity
                  style={styles.getStart}
                  onPress={onPressStart}
                >
                  <Text style={{ color: 'white', fontSize: 24, textAlign: "center" }}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        }
      </ScrollView >
    </View >
  );
};

export default Welcome;