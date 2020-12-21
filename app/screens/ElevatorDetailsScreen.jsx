import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const ElevatorDetailsScreen = ({ navigation, route }) => {
  const [elevator, setElevator] = useState(() => route.params);
  const [parsedElevator, setParsedElevator] = useState(() => []);

  useEffect(() => {
    setParsedElevator(() => createView());
  }, []);

  // Algorithm for converting a string
  // string_form -> String Form
  const getParsedKey = (_phrase) => {
    let wordList = _phrase.split('_');

    for (let i = 0; i < wordList.length; i++) {
      let word = '';

      for (let j = 0; j < wordList[i].length; j++) {
        j == 0
          ? (word += wordList[i][j].toUpperCase())
          : (word += wordList[i][j]);
      }

      wordList[i] = word;
    }

    return wordList.join(' ');
  };

  const createView = () => {
    let keyValueList = [];

    for (const key in elevator) {
      const parsedKey = getParsedKey(key);

      keyValueList.push(
        <View style={styles.banner}>
          <Text style={styles.propTitle}>{parsedKey}: </Text>
          <Text style={styles.propValue}>{elevator[key]}</Text>
        </View>
      );
    }

    return keyValueList;
  };

  return (
    <ScrollView>
      {parsedElevator}
      <Button title="Change Status To Active" />
    </ScrollView>
  );
};

export default ElevatorDetailsScreen;

const styles = StyleSheet.create({
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
  propValue: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
