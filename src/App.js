import logo from './logo.svg';
import './App.css';
import Map from './Map';

function App() {
  const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

  return (
    <div className="App">
      <Map googleApiKey={googleApiKey} />
    </div>
  );
}

export default App;
