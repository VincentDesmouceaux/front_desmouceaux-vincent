import "./App.css";

import { useEffect, useState } from "react";
import axios from "axios";
// J'importe Axios qui va permettre de faire des requêtes aux API fournies dans l'énnoncé

function App() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [popular, setPopular] = useState("");
  const [show, setShow] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const [fromCity, setFromCity] = useState("");

  useEffect(() => {
    const firstSearch = async () => {
      try {
        const response = await axios.get(
          `https://api.comparatrip.eu/cities/autocomplete/?q=${search}`
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (search) {
      firstSearch();
    }

    if (data.length > 0) {
      const input = document.querySelector(".search-input");
      input && input.focus();
    }

    // const thirdSearch = async () => {
    //   try {
    //     const response = await axios.get(
    //       `https://api.comparatrip.eu/cities/popular/from/${fromCity}/5`
    //     );
    //     setData(response.data);
    //     setIsLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // thirdSearch();
  }, [search, fromCity, data]);

  useEffect(() => {
    const secondSearch = async () => {
      try {
        const response = await axios.get(
          `https://api.comparatrip.eu/cities/popular/5`
        );
        setData2(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    secondSearch();
  }, [popular]);

  const handleSelectAutoComplete = (autoComplete) => {
    setData([]);
    setSearch(autoComplete.local_name);
    setShowButton(true);
  };

  return isLoading ? (
    <p>Loading... </p>
  ) : (
    <div className="searchbar-main">
      <input
        value={search}
        type="text"
        className="search-input"
        placeholder={search ? search : "Your city..."}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        ref={(input) => input && input.focus()}
      />
      <ul>
        {data.map((autoComplete) => (
          <li
            key={autoComplete.city_id}
            onClick={() => handleSelectAutoComplete(autoComplete)}
          >
            {autoComplete.local_name}
          </li>
        ))}
      </ul>
      {!showButton && (
        <div className="dropdown">
          <button className="mostPop" onClick={() => setShow(!show)}>
            Top 5 cities
          </button>
          {show && (
            <div className="display">
              {data2.map((top) => (
                <button
                  key={top.id}
                  onClick={() => {
                    setPopular(top.local_name);
                    setShow(false);
                  }}
                >
                  {top.local_name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {!show && popular !== "" && (
        <button className="mostPop" onClick={() => setShow(true)}>
          {popular}
        </button>
      )}
      <input type="text" />
    </div>
  );
}

export default App;
