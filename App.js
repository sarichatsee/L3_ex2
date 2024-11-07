import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from "react-native-vector-icons/FontAwesome6";
import { Audio } from 'expo-av';
import { Video } from 'expo-av';

const QuizQuestion = ({ question, options, onSelect, selectedAnswer }) => {
  // Function to play audio
  const playAudio = async () => {
    if (question.audio) {
      const { sound } = await Audio.Sound.createAsync(question.audio);
      await sound.playAsync();
    }
  };

  return (
    <View style={styles.questionContainer}>
      {question.image && <Image source={question.image} style={styles.image} />}
      {question.audio && (
        <TouchableOpacity style={styles.audioButton} onPress={playAudio}>
          <Text style={styles.audioButtonText}>Play Audio</Text>
        </TouchableOpacity>
      )}
      {question.video && (
        <Video
          source={question.video}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping={false}
        />
      )}
      <Text style={styles.questionText}>{question.text}</Text>
      <RNPickerSelect
        onValueChange={(value) => onSelect(value)}
        items={options.map(option => ({ label: option, value: option }))}
        value={selectedAnswer}
        style={{
          inputAndroid: {
            color: 'black',
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            marginBottom: 10,
          },
        }}
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
    },
    {
      id: 4,
      text: "What is the name of this weapon?",
      image: require('./assets/img/IMG0010.jpg'),
      correctAnswer: "Dark Moon Greatsword",
      options: ["Ruins Greatsword", "Dark Moon Greatsword", "Bolt of Gransax", "Sword of Night and Flame"],
    },
    // Audio question with require for static file reference
    {
      id: 5,
      text: "Which character tells you this?",
      audio: require('./assets/audio/SOUND0015.wav'), // Use require for direct reference
      correctAnswer: "Adan, Thief of Fire",
      options: ["Demi-Human Queen Gilika", "Commander Niall", "Margit, The Fell Omen", "Adan, Thief of Fire"]
    },
    // Video question
    {
      id: 6,
      text: "Which incantation is this player using?",
      video: require('./assets/vid/VID0012.webm'), // WebM video file
      correctAnswer: "Litany of Proper Death",
      options: ["Golden Vow", "Litany of Proper Death", "Order's Blade", "Urgent Heal"]
    },
    {
      id: 7,
      text: "What important landmark is shown in this image?",
      image: require('./assets/img/IMG0031.jpg'),
      correctAnswer: "A Stake of Marika",
      options: ["A Stake of Marika", "A Spiritspring", "A Martyr Effigy", "A Divine Tower"]
    },
    {
      id: 8,
      text: "When do you hear this sound?",
      audio: require('./assets/audio/SOUND0005.mp3'),
      correctAnswer: "When drinking a flask",
      options: [
        "When drinking a flask",
        "When you get a critical hit",
        "When you use a Spiritspring",
        "When you discover a Site of Lost Grace"
      ]
    },
    {
      id: 9,
      text: "What is the name of this Site of Lost Grace?",
      image: require('./assets/img/IMG0027.jpg'),
      correctAnswer: "Erdtree-Gazing Hill",
      options: ["Ailing Village Outskirts", "Fallen Ruins of the Lake", "Erdtree-Gazing Hill", "Stormveil Cliffside"]
    },
    {
      id: 10,
      text: "Which character tells you this?",
      audio: require('./assets/audio/SOUND0016.wav'),
      correctAnswer: "Rennala, Queen of the Full Moon",
      options: ["Perfumer Tricia", "Rennala, Queen of the Full Moon", "Godfrey the Grafted", "Malenia, Blade of Miquella"]
    },
  ];
  
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const allAnswered = questions.every((question) => answers[question.id] !== undefined);

    if (!allAnswered) {
      Alert.alert("Incomplete Quiz", "Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    let message = `You got ${correctCount} out of ${questions.length} correct.`;
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
          selectedAnswer={answers[question.id]}
        />
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { opacity: questions.every(q => answers[q.id]) ? 1 : 0.5 }]}
          onPress={handleSubmit}
          disabled={!questions.every(q => answers[q.id])}
        >
          <Text style={styles.buttonText}>SUBMIT ANSWERS</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff', // Light background for the app
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1e90ff',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'contain',
    borderRadius: 10,
    marginVertical: 10,
  },
  video: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  audioButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  audioButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerSelect: {
    color: 'black',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
