import './App.css';
import Map from './Map';
import SnackbarProvider from 'react-simple-snackbar';

function App() {
  let googleApiKey = String(localStorage.getItem("googleApiKey"));


  while (googleApiKey == "null" || googleApiKey == "") {
    const googleApiKeyNew = prompt("What is the api key?");
    localStorage.setItem("googleApiKey", googleApiKeyNew);
    googleApiKey = localStorage.getItem("googleApiKey");
  }


  return (
    <div className="App">
      <SnackbarProvider>
        <Map googleApiKey={googleApiKey} />
      </SnackbarProvider>
    </div>
  );
}

export default App;
