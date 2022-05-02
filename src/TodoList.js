import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import React, { useContext, useState } from 'react'
import { TodosContext } from './TodosContext'
import { SwipeListView } from 'react-native-swipe-list-view'
import { VStack, Input, Icon, NativeBaseProvider, Box, Heading,} from 'native-base';
import uuid from 'uuid-random';
import { FontAwesome5 } from "@expo/vector-icons";

const LinearGradient = require("expo-linear-gradient").LinearGradient;


const TodoList = () => {
    // receive state and dispatch from App.js
    const {state, dispatch} = useContext(TodosContext); 
    const [todoText, setTodoText] = useState("")
    const [editMode, setEditMode] = useState(false)    
    const [editTodo, setEditTodo] = useState(null)    
    const buttonTitle = editMode ? "Edit" : "Add";

    const handleSubmit = () =>{
        if(editMode){            
            dispatch({type: 'edit', payload:{...editTodo,text:todoText}})
            setEditMode(false)
            setEditTodo(null)
        }
        else{
            const newToDo = {id: uuid(), text: todoText};
            dispatch({type: 'add', payload: newToDo})
        }              
        setTodoText('') // to clear field after adding     
    }

    const renderItem = data => (
        <Box bg={{
            linearGradient: {
            colors: ["lightBlue.300", "violet.800"],
            start: [0, 0],
            end: [1, 0]
            }
        }} 
        p="12" 
        rounded="xl" 
        _text={{
            fontSize: "md",
            fontWeight: "medium",
            color: "warmGray.50",
            textAlign: "center"
        }}
        
        >
            {data.item.text}
        </Box>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity onPress={() => editRow(data.item, rowMap)}>
                <Text>Edit</Text>
            </TouchableOpacity>  
            <TouchableOpacity
                style={[styles.backRightBtn]}
                onPress={() => deleteRow(data.item)}                
            >
                <Text style={{color: '#FFF'}}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    const deleteRow = (todo) => {
        dispatch({type:'delete',payload:todo});
    };

    const editRow = (todo,rowMap) => {        
        setTodoText(todo.text)
        setEditMode(true)
        setEditTodo(todo)
        if (rowMap[todo.id]) {
            rowMap[todo.id].closeRow();
        }        
    };

    return(
        <View style={{flex:1, marginTop:60}}>
            <View style={{ marginLeft:5, marginBottom:10}}>
            <VStack w="100%"  space={5} alignSelf="center">
                <Heading fontSize="2xl">To-Do</Heading>
                <View style={{flexDirection:'row', marginRight:60, marginLeft:2}}>
                <Input 
                    placeholder="Enter To-Do" 
                    onChangeText={text => setTodoText(text)}
                    value={todoText}
                    variant="filled" 
                    width="100%" 
                    borderRadius="10" 
                    py="1" 
                    px="2" 
                    borderWidth="7" 
                    InputLeftElement={<Icon ml="2" size="7" color="gray.400" 
                    as={<FontAwesome5 name="pencil-alt" />} />} 
                />
                <Button transparent 
                    onPress={handleSubmit} 
                    title={buttonTitle}
                    style={{height:20}}
                />
                </View>
                
            </VStack>
            
            </View> 
            <SwipeListView
                data={state.todos}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-75}
            />
        </View>
    )
}

const config = {
    dependencies: {
      "linear-gradient": LinearGradient
    }
  };

export default () => {
    return (
        <NativeBaseProvider config={config}>
            <TodoList/>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        backgroundColor: 'red',
        right: 0
    },
    
});