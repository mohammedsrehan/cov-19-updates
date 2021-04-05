import React, { useEffect, useState } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import "./App.css";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import "./Home.css";
import NewsCard from "./NewsCard";
import { Link } from "react-router-dom";

function Home() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountyInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 77 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);
  const [casesType, setcasesType] = useState("cases");
  const [newsCard, setnewsCard] = useState([]);
  const [passData, setpassData] = useState([]);

  useEffect(() => {
    const getNewsData = async () => {
      const ApiKey = "API-KEY";
      await fetch(
        `https://gnews.io/api/v4/search?q=covid&lang=en&max=20&token=${ApiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          const articles = data.articles.slice(0, 4);
          const newsData = articles.map((articles) => ({
            title: articles.title,
            url: articles.url,
            urlToImage: articles.image,
            publishedAt: articles.publishedAt,
            source: articles.source,
          }));
          setnewsCard(newsData);
          setpassData(data);
        });
    };
    getNewsData();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountyInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setmapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountyInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setcasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setcasesType("recovered")}
            title="Coronavirus recoveries"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setcasesType("deaths")}
            title="Coronavirus deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
        <Card className="app__news">
          <div className="app__news__header">
            <h4>News Updates</h4>
            <ul>
              <li>
                <Link to={{ pathname: "/newsupdates", state: passData }}>
                  See All
                </Link>
              </li>
            </ul>
          </div>
          <div className="app__news__card">
            {newsCard.map((info) => (
              <NewsCard
                title={info.title}
                url={info.url}
                urlToImage={info.urlToImage}
                publishedAt={info.publishedAt}
                source={info.source}
              />
            ))}
          </div>
        </Card>
      </div>
      <div className="app-right">
        <Card className="app__rigth__top">
          <CardContent>
            <h3>Live Cases By Countries</h3>
            <Table countries={tableData} />
          </CardContent>
        </Card>
        <Card className="app__rigth__top">
          <CardContent>
            <h3>World Wide New {casesType}</h3>
            <LineGraph casesType={casesType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
