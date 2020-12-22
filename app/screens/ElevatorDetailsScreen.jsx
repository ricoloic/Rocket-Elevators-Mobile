GLOBAL = require('../global');

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

const ElevatorDetailsScreen = ({ navigation, route }) => {
  const [elevator, setElevator] = useState(() => route.params.elevator);
  const [parsedElevator, setParsedElevator] = useState(() => []);
  const [isGoBackBtn, setIsGoBackBtn] = useState(() => false);

  const logOutBtn = (props) => (
    <TouchableOpacity
      onPress={() => navigation.popToTop()}
      style={styles.logOutBtn}
    >
      <Text style={{ fontWeight: 'bold' }}>LogOut</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerRight: logOutBtn,
    });
  }, []);

  // call a function only once after useState
  useEffect(() => {
    setParsedElevator(() => createView());
  }, []);

  // Algorithm for converting a string
  // string_form -> String Form
  const getParsedKey = (_phrase) => {
    // create a list of words based on the phrase and remove the underscore
    let wordList = _phrase.split('_');

    // iterate through the words
    for (let i = 0; i < wordList.length; i++) {
      // for every word create a "word" variable and set it to empty
      let word = '';

      // iterate through character in the word
      for (let j = 0; j < wordList[i].length; j++) {
        if (j == 0) {
          // if at first character change it to uppercase then add it to the word
          word += wordList[i][j].toUpperCase();
        } else {
          // else add the character to the word
          word += wordList[i][j];
        }
      }

      // replace the word from the word list to the converted word
      wordList[i] = word;
    }

    // join and return the word list
    return wordList.join(' ');
  };

  // create the view for rendering the information of the elevator
  const createView = (isActive = false) => {
    // let new list for the keys and value in the correct component
    let keyValueList = [];

    // for every key in the elevator
    for (const key in elevator) {
      // get the correct string format for the particular key and set it to parsedKey
      const parsedKey = getParsedKey(key);

      // add the render of each key and value to the list
      keyValueList.push(
        <View key={key} style={styles.banner}>
          <Text style={styles.propTitle}>{parsedKey}: </Text>
          {/* change the text color for the value of elevator status */}
          {key == 'elevator_status' ? (
            isActive ? (
              <Text style={styles.propValueSuccess}>Active</Text>
            ) : (
              <Text style={styles.propValueImportant}>{elevator[key]}</Text>
            )
          ) : (
            <Text style={styles.propValue}>{elevator[key]}</Text>
          )}
        </View>
      );
    }

    // return the list for the render
    return keyValueList;
  };

  const navigateToHomeScreen = () => navigation.pop();

  const handleChangeToActive = async () => {
    await axios
      .get(
        `https://loicricorest.azurewebsites.net/api/Elevators/ChangeActive/${elevator.id}`
      )
      .then((res) => {
        if (res.status == 200) {
          // change global temporary elevator property isActive to true
          GLOBAL.tempElevator.isActive = true;
          setIsGoBackBtn(() => true);
          setParsedElevator(() => createView(true));
        }
      })
      .catch((err) => {
        // console.log(err);
        // Alert.alert(
        //   `There was an error while changing the status of the elevator...`
        // );
      });
  };

  // render/return the list
  return (
    <ScrollView>
      {parsedElevator}

      {isGoBackBtn ? (
        <TouchableOpacity onPress={navigateToHomeScreen}>
          <Text style={styles.btnStatus}>Go Back</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleChangeToActive}>
          <Text style={styles.btnStatus}>Change Status To Active</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default ElevatorDetailsScreen;

const styles = StyleSheet.create({
  logOutBtn: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: '#aa0505',
  },
  banner: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 2,
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    paddingVertical: 7,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  propTitle: {
    fontSize: 20,
  },
  propValueImportant: {
    color: '#aa0505',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  propValueSuccess: {
    color: 'green',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  propValue: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnStatus: {
    fontSize: 20,
    backgroundColor: '#aa0505',
    color: '#fff',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
