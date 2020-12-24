GLOBAL = require('../global');

import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

// define the render function for the component
const HomeScreen = ({ navigation }) => {
  // set the variable isFocus which is use to create an
  // update on goBack() from other screen
  const isFocused = useIsFocused();

  // set offset state used for api call
  const [offset, setOffset] = useState(() => 0);

  // set amount state also for api call
  const [amount, setAmount] = useState(() => 40);

  // set elevatorList state for the list of inactive elevator
  const [elevatorList, setElevatorList] = useState(() => []);

  // set loading state for button load more
  const [loadingState, setLoading] = useState(() => {
    return { text: 'Load More', loading: false };
  });

  // helper function for changing the global "state" object
  const setGlobal = (id, state) => {
    GLOBAL.tempElevator.id = id;
    GLOBAL.tempElevator.isActive = state;
  };

  const logOutBtn = (props) => (
    <View style={styles.logOutBtn}>
      <Text
        style={{ fontWeight: 'bold' }}
        onPress={() => navigation.popToTop()}
      >
        LogOut
      </Text>
    </View>
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerLeft: (props) => <></>,
      headerRight: logOutBtn,
    });
  }, []);

  // append once on first load
  useEffect(() => {
    getElevators();
  }, []);

  // append every change on isFocused
  useEffect(() => {
    GLOBAL.tempElevator.isActive ? rmTempFromList() : null;
  }, [isFocused]);

  // used for removing the elevator not active from the list
  // and reset global "state"
  const rmTempFromList = () => {
    const list = elevatorList.filter(
      (elev) => elev.id != GLOBAL.tempElevator.id
    );

    setElevatorList(list);
    setGlobal(undefined, false);
  };

  // function for navigating to the detail screen
  const goToDetails = (elevator) => {
    setGlobal(elevator.id, false);

    navigation.navigate('ElevatorDetails', {
      elevator: elevator,
    });
  };

  // api call for retrieving the list of elevator not active
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
    // scroll-able container
    <ScrollView>
      {/* if elevator list is not empty avoid calculation */}
      {elevatorList.length > 0
        ? elevatorList.map((elev) => (
            <TouchableOpacity key={elev.id} onPress={() => goToDetails(elev)}>
              <Text style={styles.elevatorTextBox}>Elevator #{elev.id}</Text>
            </TouchableOpacity>
          ))
        : null}

      {/* set the button for loading more elevator based on its state */}
      {loadingState.loading ? (
        <Text style={styles.btnStatus}>{loadingState.text}</Text>
      ) : (
        <TouchableOpacity onPress={getElevators}>
          <Text style={styles.btnStatus}>{loadingState.text}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  logOutBtn: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: '#aa0505',
  },
  elevatorTextBox: {
    textAlign: 'center',
    fontSize: 35,
    padding: 10,
    borderBottomColor: 'lightgray',
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    borderBottomWidth: 1,
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
