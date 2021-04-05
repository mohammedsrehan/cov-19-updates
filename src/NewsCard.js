import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import React from "react";
import "./NewsCard.css";
import { timeSince } from "./util";

function NewsCard({ title, url, urlToImage, publishedAt, source }) {
  return (
    <div>
      <Card className="newsCard">
        <CardContent className="newsCard__content">
          <div className="newsCard__media__container">
            <CardMedia className="newsCard__media" image={urlToImage} />
          </div>
          <Typography variant="subtitle1">{title}</Typography>
        </CardContent>
        <CardContent className="newsCard__footer">
          <div className="newsCard__footer__container">
            <Typography className="newsCard__footer__container__source">
              {source.name}
            </Typography>
            <Typography color="textSecondary" className="time">
              {`${timeSince(publishedAt)} ago`}
            </Typography>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewsCard;
