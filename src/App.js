import "./App.css";

import { useEffect, useState } from "react";
import axios from "axios";

// J'importe Axios qui va permettre de faire des requêtes aux API fournies dans l'énnoncé

function App() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [popular, setPopular] = useState("");
  const [show, setShow] = useState(false);
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
    } else {
      setData([]);
    }
  }, [search]);

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

  useEffect(() => {
    const thirdSearch = async () => {
      try {
        const response = await axios.get(
          `https://api.comparatrip.eu/cities/popular/from/${fromCity}/5`
        );
        setData3(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (fromCity) {
      thirdSearch();
    } else {
      setData3([]);
    }
  }, [fromCity]);

  useEffect(() => {
    const handleClick = async () => {
      setData([]);
      setShow(false);
      setFromCity("");
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handleSelectAutoComplete = (autoComplete) => {
    setData([]);
    setSearch(autoComplete.local_name);
    setShow(false);
  };

  return isLoading ? (
    <p>Loading... </p>
  ) : (
    <div>
      <div
        className="searchbar-main"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="titre">My Search Bar</div>
        <input
          value={search}
          type="text"
          className="search-input your-city"
          placeholder={search ? search : "Your city..."}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
        <ul className="firstSearch">
          {data.map((autoComplete) => (
            <li
              key={autoComplete.city_id}
              onClick={() => handleSelectAutoComplete(autoComplete)}
            >
              {autoComplete.local_name}
            </li>
          ))}
        </ul>

        <div className="dropdown">
          <div className="list">
            <button className="mostPop" onClick={() => setShow(!show)}>
              Top 5 cities
            </button>
            {show && (
              <div className="display">
                <ul className="uldrop">
                  {data2.map((top) => (
                    <li
                      key={top.id}
                      onClick={() => {
                        setPopular(top.local_name);
                        setShow(false);
                      }}
                    >
                      {top.local_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {!show && popular !== "" && (
          <button className="mostPop" onClick={() => setShow(true)}>
            {popular}
          </button>
        )}
        <div style={{ position: "relative" }}>
          <input
            value={fromCity}
            type="text"
            className="search-input"
            placeholder="Top 5 popular cities from..."
            onChange={(event) => {
              setFromCity(event.target.value);
            }}
          />
          <ul className="third-input">
            {data3.map((from) => (
              <li
                key={from.id}
                onClick={() => {
                  setData3([]);
                  setFromCity(from.unique_name);
                }}
              >
                {from.unique_name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <img src="/word.png" alt="word" className="world" />
    </div>
  );
}

export default App;
