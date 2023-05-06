import "./App.css";
import axios from "axios";
// J'importe Axios qui va permettre de faire des requêtes aux API fournies dans l'énnoncé

import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [popular, setPopular] = useState("");
  const [fromCity, setFromCity] = useState("");

  useEffect(() => {
    const firstSearch = async () => {
      try {
        const reponse = await axios.get(
          `https://api.comparatrip.eu/cities/autocomplete/?q=${search}`
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    firstSearch();
  }, [search]);

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
