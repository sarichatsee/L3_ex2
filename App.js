import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from "react-native-vector-icons/FontAwesome6";

const QuizQuestion = ({ question, options, onSelect }) => {
  return (
    <View style={styles.questionContainer}>
      <Image source={question.image} style={styles.image} />
      <Text style={styles.questionText}>{question.text}</Text>
      <RNPickerSelect
        onValueChange={(value) => onSelect(value)}
        items={options.map(option => ({ label: option, value: option }))}
        style={{ inputAndroid: { color: 'black', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10 } }}
        placeholder={{ label: "Choose an answer", value: null }}
      />
    </View>
  );
};

const App = () => {
  const [answers, setAnswers] = useState({});
  
  const questions = [
    {
      id: 1,
      text: "What is the name of this insect?",
      image: require('./assets/img/bee.jpg'),
      correctAnswer: "Bee",
      options: ["Bee", "Hornet", "Beetle"]
    },
    {
      id: 2,
      text: "Which animal is known to live in water and on land?",
      image: require('./assets/img/crocodile.jpg'),
      correctAnswer: "Crocodile",
      options: ["Crocodile", "Alligator", "Monitor Lizard"]
    },
    {
      id: 3,
      text: "This animal is often found in forests. What is it?",
      image: require('./assets/img/deer.jpg'),
      correctAnswer: "Deer",
      options: ["Deer", "Elk", "Goat"]
    }
  ];

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    let message = "";
    if (correctCount === 3) {
      message = "Excellent! You got all answers correct!";
    } else if (correctCount === 2) {
      message = "Good job! You got 2 out of 3 correct.";
    } else if (correctCount === 1) {
      message = "Nice try! You got 1 correct answer.";
    } else {
      message = "You can do better next time. Try again!";
    }

    Alert.alert("Quiz Result", message);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="paw" size={30} color="black" />
        <Text style={styles.title}>Animal Quiz</Text>
      </View>

      {questions.map((question) => (
        <QuizQuestion
          key={question.id}
          question={question}
          options={question.options}
          onSelect={(answer) => handleAnswerSelect(question.id, answer)}
        />
      ))}

      {/* Button with custom padding and margin */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>SUBMIT ANSWERS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginVertical: 10,
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,   // Add margin around the button
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,   // Vertical padding for height
    paddingHorizontal: 30, // Horizontal padding for width
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
