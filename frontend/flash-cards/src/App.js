import './App.css';
import { Flashcard } from './Flashcard';

function App() {

  const front = "Question";
  const back = "Answer";

  return (
    <div className="App">
      <h1>Flashcard</h1>
      <Flashcard Front={front}
                 Back={back}/>
    </div>
  );
}

export default App;
