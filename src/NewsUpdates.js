import React from "react";
import NewsCard from "./NewsCard";
import "./NewsUpdates.css";

function NewsUpdates(props) {
  const data = props.location.state.articles;
  const newsData = data.map((articles) => ({
    title: articles.title,
    url: articles.url,
    urlToImage: articles.image,
    publishedAt: articles.publishedAt,
    source: articles.source,
  }));

  return (
    <div className="newsUpdates">
      <h3>News Updates</h3>
      <div className="newsUpdates__cards">
        {newsData.map((info) => (
          <div className="newsUpdates__card">
            <NewsCard
              title={info.title}
              url={info.url}
              urlToImage={info.urlToImage}
              publishedAt={info.publishedAt}
              source={info.source}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsUpdates;
