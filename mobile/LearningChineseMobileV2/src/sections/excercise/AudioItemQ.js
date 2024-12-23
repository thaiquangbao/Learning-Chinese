import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can choose any icon set
import CheckCircleIcon from 'react-native-vector-icons/MaterialIcons';
import CancelIcon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import { checkExcercise } from '../../api/excercise-api';
import { readStorageUrl } from '../../utils/readStorageUrl';
import { fonts } from '../../theme/fonts';
import { colors } from '../../theme/color';

const ExcerciseAudio = ({ _id, lessonId, audioQuestion, onNext }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [chooseAnswer, setChooseAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("none");
  const [answerCorrect, setAnswerCorrect] = useState("");

  const handleButtonClick = (index) => {
    setChooseAnswer(index);
    setSelectedIndex(index);
  };

  const handleCheck = () => {
    const body = {
      type: "audio-question",
      audioQuestionAnswer: {
        positionAnswer: chooseAnswer,
      },
    };
    if (chooseAnswer === null) {
      Alert.alert("Error", "Vui lòng chọn câu trả lời");
    } else {
      checkExcercise(lessonId, _id, body)
        .then(({ result }) => {
          if (result.checkResult === true) {
            setCorrectAnswer("true");
          } else {
            setCorrectAnswer("false");
            setAnswerCorrect(result.rightAnswer);
          }
        })
        .catch((err) => {
          if (err === "Lesson not found") {
            Alert.alert("Error", "Không tìm thấy bài học");
          } else if (err === "Excercise not found") {
            Alert.alert("Error", "Không tìm thấy bài tập");
          } else if (err === "Invalid question") {
            Alert.alert("Error", "Câu hỏi không hợp lệ");
          } else {
            Alert.alert("Error", "Có lỗi xảy ra");
          }
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <View
        style={{
          padding: 10,
          marginVertical: 20,
          borderRadius: 10,
          width: '100%',
          backgroundColor: '#FFFFFD',
        }}
      >
        <Text style={{ fontSize: 18, fontFamily: fonts.Medium }}>
          Nghe và chọn đáp án đúng
        </Text>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <View
            style={{
              position: 'relative',
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: '#FFFFFD',
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 5,
            }}
          >
            <Video
              source={{ uri: readStorageUrl(audioQuestion?.audioUrl) }}
              style={{
                borderRadius: 10,
                height: 50,
                width: '100%',
                backgroundColor: 'black',
                marginBottom: 10,
              }}
              controls={true}
            />
            <Text style={{ fontSize: 18, color: 'black', fontFamily: fonts.Medium }}>{audioQuestion?.question}</Text>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: [{ translateX: -100 }, { translateY: -50 }],
                width: 0,
                height: 0,
                borderTopWidth: 10,
                borderBottomWidth: 10,
                borderRightWidth: 10,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                borderRightColor: '#0000FF',
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
          {audioQuestion?.answers?.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleButtonClick(index)}
              style={{
                width: '48%',
                margin: '1%',
                backgroundColor: selectedIndex === index ? '#0099FF' : '#FFFFFF',
                borderColor: '#dfdfdf',
                borderWidth: 1,
                paddingVertical: 12,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
                transform: [{ scale: selectedIndex === index ? 1.05 : 1 }],
              }}
            >
              <Text style={{ color: selectedIndex === index ? '#FFFFFF' : '#000000', fontFamily: fonts.Medium }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            flexDirection: 'column',
            flexGrow: 1,
            backgroundColor:
              correctAnswer === "true" ? "#33CC33" : correctAnswer === "false" ? "#FF0000" : "#FFFFFF",
            marginTop: 20,
          }}
        >
          {correctAnswer === "true" ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircleIcon name="check-circle" size={24} color="#FFFFFF" />
                <Text style={{ fontSize: 15, color: '#FFFFFF', fontWeight: '400', fontFamily: fonts.Medium }}>Làm tốt lắm!</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <TouchableOpacity
                  onPress={() => {
                    handleCheck();
                    onNext();
                  }}
                  style={{
                    height: 40,
                    width: 150,
                    backgroundColor: '#33CC33',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontSize: 13, color: '#FFFFFF', fontFamily: fonts.Medium }}>Tiếp tục</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : correctAnswer === "false" ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10 }}>
                <CancelIcon name="cancel" size={24} color="#FFFFFF" />
                <Text style={{ fontSize: 15, color: '#FFFFFF', fontWeight: '400' }}>
                  Đáp án đúng: {answerCorrect}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <TouchableOpacity
                  onPress={() => {
                    handleCheck();
                    onNext();
                  }}
                  style={{
                    height: 40,
                    width: 150,
                    backgroundColor: '#FF0000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontSize: 13, color: '#FFFFFF' }}>Tiếp tục</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <TouchableOpacity
                  onPress={handleCheck}
                  style={{
                    height: 40,
                    paddingHorizontal: 20,
                    backgroundColor: colors.primaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 30,
                  }}
                >
                  <Text style={{ fontSize: 13, color: '#FFFFFF', fontFamily: fonts.Medium }}>Kiểm tra</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ExcerciseAudio;