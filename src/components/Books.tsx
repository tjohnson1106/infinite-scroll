import React from "react";
import { List, ListItem, Paper } from "@material-ui/core";
import { Waypoint } from "react-waypoint";

import { useBooksQuery } from "../generated/ApolloHooks";

const Books = () => {
  const { data } = useBooksQuery({
    variables: { first: 50 }
  });

  if (!data || !data.books) {
    return <div> ...Loading </div>;
  }

  return (
    <div className="books-root">
      <div className="paper-wrapper">
        <Paper>
          <List>
            {data.books.books.map((x) => (
              <ListItem key={x.id}>{x.title}</ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
};

export default Books;
