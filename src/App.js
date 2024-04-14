import './App.css';
import Map from './Map';

function App() {
  let googleApiKey = String(localStorage.getItem("googleApiKey"))


  if (googleApiKey == "null" || googleApiKey == "") {
    const googleApiKeyNew = prompt("What is the api key?")
    localStorage.setItem("googleApiKey", googleApiKeyNew)
    googleApiKey = localStorage.getItem("googleApiKey")
  }


  return (
    <div className="App">
      <Map googleApiKey={googleApiKey} />
    </div>
  );
}

export default App;
