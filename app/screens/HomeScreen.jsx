import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';

const HomeScreen = ({ navigation, route }) => {
  const [offset, setOffset] = useState(() => 0);
  const [amount, setAmount] = useState(() => 10);
  const [elevatorList, setElevatorList] = useState(() => []);
  const [loadingState, setLoading] = useState(() => {
    return { text: 'Load More', loading: false };
  });

  useEffect(() => {
    getElevators();
  }, []);

  const getElevators = async () => {
    setLoading((previousState) => {
      return { text: 'Loading', loading: true };
    });

    await axios
      .get(
        `https://loicricorest.azurewebsites.net/api/Elevators/InactiveList/offset/${offset}/amount/${amount}`
      )
      .then((res) => {
        setElevatorList((previousList) => previousList.concat(res.data));

        setOffset((previousOffset) => previousOffset + amount);

        setLoading((previousState) => {
          return { text: 'Load More', loading: false };
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <ScrollView>
      {elevatorList.length > 0
        ? elevatorList.map((elev) => (
            <TouchableOpacity
              key={elev.id}
              onPress={() => navigation.navigate('ElevatorDetails', elev)}
            >
              <Text style={styles.elevatorTextBox}>Elevator #{elev.id}</Text>
            </TouchableOpacity>
          ))
        : null}
      {loadingState.loading ? (
        <Button title={loadingState.text} />
      ) : (
        <Button title={loadingState.text} onPress={getElevators} />
      )}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  elevatorTextBox: {
    textAlign: 'center',
    fontSize: 35,
    padding: 10,
    borderBottomColor: 'lightgray',
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});
