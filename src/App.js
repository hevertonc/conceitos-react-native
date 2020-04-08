import React, { useState, useEffect } from "react";

import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => { 
    api.get('repositories').then(res => {
      setRepositories(res.data);
    })
  }, []);

  async function handleLikeRepository(id) {
    const res = await api.post(`repositories/${id}/like`);
    const likes = res.data.likes;

    const reps = [...repositories]; 

    const repIndex = reps.findIndex(rep => rep.id === id);

    const repository = reps[repIndex];
    repository.likes = likes;

    reps[repIndex] = repository;
    console.log(reps);
    setRepositories(reps);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={rep => rep.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>
              
              <View style={styles.techsContainer}>
              
              { repository.techs.map(tech => (
                <Text style={styles.tech} key={tech}>
                  {tech}
                </Text>
              ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        >            
        </FlatList>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#03c260",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#7159c1",
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    padding: 15,
  },
});
