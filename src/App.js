import "./App.css";

import { useEffect, useState } from "react";

// J"importe le useState de React qui va me permettre de faire des changements dynamiques sur ma page et le useEffect qui permet de déclencher des requêtes au changement d'un state.

import axios from "axios";
// J'importe Axios qui va permettre de faire des requêtes aux API fournies dans l'énnoncé.

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar, faSearch } from "@fortawesome/free-solid-svg-icons";
library.add(faSearch, faStar);

function App() {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  // Création de trois states data  qui vont me permettre de stocker les informations des requêtes aux trois différentes API.

  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  // State correspondant à la premiére requête, permettant de faire l'appel à l'API et d'avoir en retour le résulat affiché en recherche autocomplete.

  const [popular, setPopular] = useState("");
  // State correspondant à la deuxième requête : au moment du clique sur l'une des 5 villes les plus populaires, la ville sélectionnée s'affiche .

  const [show, setShow] = useState(false);
  // state permettant d'afficher la liste des 5 villes les plus populaires.

  const [fromCity, setFromCity] = useState("");
  // State correspondant à la dernière requête qui montre à partir d'une ville selectionnée, les 5 villes les plus populaires.

  // Requête pour le premier input

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

  // Requête pour le bouton TOP 5 CITIES

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

  // Requête pour le dernier input

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

  // Fonction permettant de "nettoyer" les states lorsque l'on clique sur la page et de remettre le valeurs à 0, du coup, pas besoin de rafraichir la page pour supprimer les listes de résultats.

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

  // Fonction permettant de mettre à jour les states au moment notamment où l'on clique sur l'un des résultats qui apparait dans la liste, cela à pour effet de faire disparaitre la liste de recherche au moment du clic.

  const handleSelectAutoComplete = (autoComplete) => {
    setData([]);
    setSearch(autoComplete.local_name);
    setShow(false);
  };

  return isLoading ? (
    <p>Loading... </p>
  ) : (
    <div>
      {/* module comprenant les 3 différents types de recherche */}

      <div
        className="searchbar-main"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="titre">My Search Bar</div>

        {/* Première recherche */}
        <div className="contain">
          <FontAwesomeIcon icon={faSearch} className="iconSearch" />
          <input
            value={search}
            type="text"
            className="search-input your-city"
            placeholder={search ? search : "  Your city..."}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
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
        {/* Deuxième recherche */}

        {/* bouton qui apparait avec la ville selectionnée au moment du clic dans la liste de résultat */}

        {!show && popular !== "" && (
          <button
            className="mostPop2"
            onClick={() => {
              setShow(true);
              setPopular("");
            }}
          >
            {popular}
          </button>
        )}

        {/* bouton qui permet de faire dérouler les 5 villes les plus populaires */}

        {popular === "" && (
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
        )}

        {/* Troisème recherche */}

        <div style={{ position: "relative" }}>
          <FontAwesomeIcon icon={faSearch} className="iconSearch" />
          <input
            value={fromCity}
            type="text"
            className="search-input"
            placeholder="  Top 5 popular cities from..."
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

      {/* Image */}

      <img src="/word.png" alt="word" className="world" />
    </div>
  );
}

export default App;
