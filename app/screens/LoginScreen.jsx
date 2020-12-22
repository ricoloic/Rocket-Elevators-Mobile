// importing npm axios for http call
import axios from 'axios';

// importing react framework and useState from it
import React, { useState } from 'react';

// importing all necessary component from react native
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// importing necessary hooks for visual and input component
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

const LoginScreen = ({ navigation }) => {
  const [btnState, setBtnState] = useState(() => {
    return {
      text: 'Login',
      loading: false,
    };
  });

  // setting the value a start to empty -> keeps track of the current input value
  const [input, setInput] = useState(() => {
    return {
      // email address input field
      email: '',

      // email validation and error messages for feedback using regex expression
      isEmailValidEmail: {
        specialChar: {
          hasIt: false,
          errMsg:
            'Your email must not contain special character: white-space, #, etc',
          regex: /\s.+|°|¬|\+|_|!|#|\$|%|\?|&|\*|\(|\)|\{|\}|\[|\]|`|'|"|;|:|<|>|\/|\\|~|\^|¤|=/,
        },
        firstSection: {
          hasIt: false,
          errMsg: 'Your email must contain a proper start name',
          regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))/,
        },
        atSection: {
          hasIt: false,
          errMsg: 'Your email must contain an "@" sign',
          regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:@"]+)*)|(".+"))@/,
        },
        domainSection: {
          hasIt: false,
          errMsg: 'Your email must contain a proper domain name',
          regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+)+))/,
        },
        fullSection: {
          hasIt: false,
          errMsg: 'Your email must be in the following format: your@email.ext',
          regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))(\s|$)/,
        },
      },

      // define to true if email is in list of agent email
      isAgentEmail: false,
    };
  });

  // for outputting the error messages
  const errorMsg = () => {
    const valid = input.isEmailValidEmail;

    // skipping if email is still empty
    if (input.email != '') {
      // verification
      for (const key in valid) {
        if (!valid[key].hasIt) {
          return valid[key];
        }
      }
    }

    return { hasIt: true };
  };

  // validation for the input email
  const emailValidation = (previousEmail, _email) => {
    let validation = previousEmail.isEmailValidEmail;

    // set all validation to false
    for (const key in validation) {
      validation[key].hasIt = false;
    }

    // doing the validation and if valid set specific validation to true
    for (const key in validation) {
      if (
        key == 'specialChar'
          ? !validation[key].regex.test(_email)
          : validation[key].regex.test(_email)
      ) {
        validation[key].hasIt = true;
      }
    }

    // return the validation result
    return validation;
  };

  // change the input to the value passed
  const changeInputState = (_email) => {
    setInput((previousEmail) => ({
      // set current email
      email: _email,

      // validates email
      isEmailValidEmail: emailValidation(previousEmail, _email),
      isAgentEmail: previousEmail.isAgentEmail,
    }));
  };

  // has te name imply
  const navigateToHomeScreen = () => {
    // passing the list of elevators to the screen
    navigation.navigate('Home');

    // change the state of the login button back to login state
    setBtnState((previousState) => ({
      text: 'Login',
      loading: false,
    }));

    // reset the input state (ready for log out)
    setInput((prevInput) => ({
      email: '',
      isEmailValidEmail: prevInput.isEmailValidEmail,
      isAgentEmail: false,
    }));
  };

  // validates the email formulation and return true || false
  const isEmailValid = () => {
    let isPassing = true;

    // verify each email email validation and change the state of the
    // isPassing variable depending on the validation
    for (const key in input.isEmailValidEmail) {
      !input.isEmailValidEmail[key].hasIt ? (isPassing = false) : null;
    }

    // return the validation state ( true || false )
    return isPassing;
  };

  // has the name imply
  const verifyEmailInput = (hasEmail) => {
    // if email is valid create connection to app and set the logged user
    if (hasEmail) {
      // set the state of the login button to the connecting state
      setBtnState((previousState) => ({
        text: 'Connecting',
        loading: true,
      }));

      // call the navigation function for navigating to the home screen
      navigateToHomeScreen();
    } else {
      // if the are failed prompt the user with an error alert box
      Alert.alert('You shall not pass!');

      // reset the button for login to the login state
      setBtnState((previousState) => ({
        text: 'Login',
        loading: false,
      }));
    }
  };

  const getEmailList = async () => {
    // parse email and prep for sending
    const parsedEmail = input.email.toLowerCase().split(' ')[0];

    // get list of email address from api using axios
    await axios
      .get(
        'https://loicricorest.azurewebsites.net/api/Employees/Email/' +
          parsedEmail
      )

      // after request and passing the response
      .then((res) => verifyEmailInput(res.data))

      // if request fail -> pass error
      .catch(
        (err) => /* console.log('Error in the GET request: ' + err) */ null
      );
  };

  // verifying the email based on api call
  const verifyEmail = () => {
    // verify the validity of the email for making the api call
    if (isEmailValid()) {
      // set the button for login to the loading state
      setBtnState((previousState) => ({
        text: 'Loading...',
        loading: true,
      }));

      // retrieve the list of agent email
      getEmailList();
    } else {
      // if email validation (regex) failed prompt user with error alert box
      Alert.alert('You must provide a valid email address for login in.');
    }
  };

  return (
    // the background image and property
    <ImageBackground
      style={styles.background}
      // importing the img necessary from function require
      source={require('../assets/img/background/1-min.jpg')}
    >
      {/* the logo container and prop */}
      <View style={styles.logoContainer}>
        {/* the logo image and prop */}
        <Image
          style={styles.logo}
          // importing the img necessary from function require
          source={require('../assets/img/logo/R2.png')}
        />
      </View>

      {/* the form and prop */}
      <View style={styles.formContainer}>
        {/* the input box and prop */}
        <TextInput
          // adding the "event listener" for a press on
          onChangeText={changeInputState}
          // setting the value of the input ( every time ( every update -> press, load, ... ) )
          value={input.email}
          // placeholder value for input when value is empty
          placeholder={'your@email.com'}
          style={styles.inputBox}
        />

        {/* verify validation and if invalid output error message for email input */}
        {!errorMsg().hasIt ? (
          <Text style={styles.inputErr}>{errorMsg().errMsg}</Text>
        ) : null}

        {/* set the button for login to loading if in loading state */}
        {btnState.loading ? (
          <View style={styles.loginButton}>
            <Text style={styles.loginText}>{btnState.text}</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={verifyEmail}>
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>{btnState.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

// exporting the login component
export default LoginScreen;

// styling for the login page
const styles = StyleSheet.create({
  // background image style
  background: {
    paddingTop: Platform.OS !== 'ios' ? StatusBar.currentHeight : 0,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // logo container style
  logoContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 45,
  },

  // logo style
  logo: {
    width: 300,
    height: 100,
    position: 'absolute',
    top: 50,
  },

  // form container style
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // input box style
  inputBox: {
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
    fontSize: 17,
    padding: 20,
    borderRadius: 25,
  },

  // input error text style
  inputErr: {
    textAlign: 'center',
    color: 'red',
  },

  // view for login style
  loginButton: {
    width: '100%',
    height: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.39)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(222, 40, 40, 0.3)',
    justifyContent: 'center',
    marginTop: 20,
  },

  // login text style
  loginText: {
    fontFamily: 'sans-serif-light',
    color: 'rgb(190, 34, 34)',
    fontSize: 34,
    fontWeight: 'normal',
    textAlign: 'center',
  },
});
