import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useRef } from 'react'
 import TodoCard from './components/TodoCard';

 import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from "@clerk/clerk-react";

const firebaseUrl = "https://todo-host-default-rtdb.asia-southeast1.firebasedatabase.app/"

function App() {
  let taskInput = useRef();
  let [submitted,setSubmitted] = useState(false);
  let[todos,setTodos] = useState([])
  let {user} = useUser();
  let {isSignedIn} = useAuth();

  useEffect(()=>{
    fetchDetails()
  }, [])

  function submitHandler() {
    setSubmitted(true)
    let task = taskInput.current.value
    taskInput.current.value = ""
    axios.post(`${firebaseUrl}todos.json`,{
      title: task,
      createdBy: user.username,
    }).then(()=> {
      setSubmitted(false)
      fetchDetails()
    })

  }


  function fetchDetails() {
    axios.get(`${firebaseUrl}todos.json`).then(todos => {
      let array = []

      for (let key in todos.data) {
        let todo = {
          id : key,
          ...todos.data[key]
        }
        array.push(todo)
      }

      setTodos(array);
    });
  }

  function deleteTodo(id) {
    axios.delete(`${firebaseUrl}todos/${id}.json`).then(()=> {
      fetchDetails()
    })
  }

  return (

    <div className=" ">

    
      <header className='flex justify-end p-5 bg-red-300'>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>


    <SignedIn>
        <div className="w-full md:w-[500px] p-3 mx-auto mt-10">
          <div >
              <h1 className="text-3xl font-bold">Manage your tasks</h1>
              <p className='text-lg mt-1 mb-1'>The time for Action is now. It's never too late to do something!</p>
              <input ref={taskInput} className="mt-2 border rounded-xl p-3 w-full focus:outline-none border-neutral-300" type="text" placeholder="Add task i.e. Learn Hooks in react" />
              <button onClick={submitHandler} className="mt-2 bg-violet-100 py-2 px-5 text-violet-800 rounded-xl">Submit</button>  <span>{submitted ? "submitted" : ""}</span>
          </div>

        {
          todos && todos.filter(todo => isSignedIn ? todo.createdBy == user.username : true).map((todo)=> (<TodoCard  title = {todo.title} key = {todo.id} id = {todo.id} deleteTodo = {deleteTodo} />))
        }

        

           
        </div>
    </SignedIn>
    
    </div>

    

    
  )
}

export default App
