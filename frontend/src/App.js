import { BrowserRouter ,Routes,Route} from 'react-router-dom';
import './App.css'
import React from "react"
import Format from './components/formatter';
import AddData from './components/addingData';
import Form from './components/search'
import JsonBeautifier from './components/jsonBeauty'


function App() {


  return (

    <BrowserRouter>
    <Routes>
      
      <Route path="/" element={<Format/>}/>

      <Route path="/add" element={<AddData/>}/>

      <Route path="/search" element={<Form/>}/>

      <Route path="/json" element={<JsonBeautifier/>}/>
      
    </Routes>
</BrowserRouter>
  );
}


export default App;


