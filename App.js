import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Switch } from 'react-native';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from './firebase';

export default function App() {
  // State to store the list of tasks
  const [tasks, setTasks] = useState([]);
  // State to store the input value for the task title
  const [taskTitle, setTaskTitle] = useState('');
  // State to store the message to be displayed
  const [message, setMessage] = useState('');

  // Fetch tasks from Firebase on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCol = collection(db, 'tasks');
      const taskSnapshot = await getDocs(tasksCol);
      const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskList);
    };
    fetchTasks();
  }, []);

  // Function to add a new task
  const addTask = async () => {
    // Checking if the task title is not empty
    if (taskTitle.trim().length > 0) {
      // Adding the new task to Firestore with a default status of 'due' (false)
      const newTask = { title: taskTitle, status: false };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      // Adding the new task to the local state
      setTasks([...tasks, { id: docRef.id, ...newTask }]);
      // Displaying a message indicating the task was added
      showMessage(`Task "${taskTitle}" added.`);
      // Clearing the input field
      setTaskTitle('');
    }
  };

  // Function to toggle the status of a task
  const toggleStatus = async (id) => {
    // Updating the status of the task with the given id in Firestore
    const task = tasks.find(task => task.id === id);
    const newStatus = !task.status;
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, { status: newStatus });
    // Updating the status of the task in the local state
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
    // Displaying a message indicating the status change
    showMessage(`Task "${task.title}" status changed to ${newStatus ? 'done' : 'due'}.`);
  };

  // Function to delete a task
  const deleteTask = async (id) => {
    // Find the task to be deleted
    const taskToDelete = tasks.find(task => task.id === id);
    // Removing the task from Firestore
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
    // Removing the task from the local state
    setTasks(tasks.filter(task => task.id !== id));
    // Displaying a message indicating the task was deleted
    showMessage(`Task "${taskToDelete.title}" deleted.`);
  };

  // Function to show a message for a short duration
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 1000); // Message will disappear after 1 second
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ToDoApp</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        {/* Disabling the ADD TASK button if the input field is empty */}
        <Button title="ADD TASK" onPress={addTask} disabled={taskTitle.trim().length === 0} />
      </View>
      {/* Displaying the message */}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            {/* Switch to toggle the status of the task */}
            <Switch
              value={item.status}
              onValueChange={() => toggleStatus(item.id)}
            />
            {/* Adding a space between the switch and delete button */}
            <View style={styles.spacer}></View>
            {/* Touchable text to delete the task */}
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  taskTitle: {
    fontSize: 18,
    flex: 1,
  },
  spacer: {
    width: 10, // Adding a fixed width spacer
  },
  deleteButton: {
    backgroundColor: 'purple',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  message: {
    marginBottom: 20,
    fontSize: 16,
    color: 'red',
  },
});
