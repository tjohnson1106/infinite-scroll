import React from "react";
import { List, ListItem, Paper } from "@material-ui/core";
import { Waypoint } from "react-waypoint";

import { useBooksQuery } from "../generated/ApolloHooks";
import "../App.css";

const Books = () => {
  // implement fetch more
  const { data, fetchMore } = useBooksQuery({
    variables: { first: 50 }
  });

  if (!data || !data.books) {
    return <div> ...Loading </div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#B19BFF"
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "auto",
          padding: 10,
          backgroundColor: "#A384D9"
        }}
      >
        <Paper
          style={{
            backgroundColor: "#100e17"
          }}
        >
          <List
            style={{
              color: "#fff",
              fontSize: 23
            }}
          >
            {data.books.books.map((x, i) => (
              <React.Fragment key={x.id}>
                <ListItem key={x.id}>{x.title}</ListItem>
                {i === data.books.books.length - 10 && (
                  <Waypoint
                    onEnter={() =>
                      fetchMore({
                        variables: {
                          first: 50,
                          cursor:
                            data.books.books[data.books.books.length - 1].id
                        },
                        // merge into existing data
                        updateQuery: (pv, { fetchMoreResult }) => {
                          if (!fetchMoreResult) {
                            return pv;
                          }

                          return {
                            books: {
                              __typename: "BooksResponse",
                              books: [
                                ...pv.books.books,
                                ...fetchMoreResult.books.books
                              ],
                              hasNextPage: fetchMoreResult.books.hasNextPage
                            }
                          };
                        }
                      })
                    }
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
};

export default Books;
