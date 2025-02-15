import './App.css';
import { Flashcard } from './Flashcard';
import { Menu } from './Menu';
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [chosenTable, setChosenTable] = useState(null);
  const [cards, setCards] = useState([]);

  const front = "Question";
  const back = "Answer";

  useEffect(() => {
    fetch('http://localhost:5000/api/tables')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data: ', error));

  }, []);

  function handleTablePick(tableName) {
    setChosenTable(tableName);
  }

  return (
    <div className="App">

      <Menu setChosenTable={setChosenTable}
            chosenTable={chosenTable}
            data={data}
            setCards={setCards}/>

      <Flashcard Front={front}
                Back={back}
                tableChosen={chosenTable}
                cards={cards}/>
      
    </div>
  );
}

export default App;
