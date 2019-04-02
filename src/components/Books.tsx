import React from "react";
import {
  List,
  ListItem,
  Paper,
  CircularProgress,
  ListItemText,
  ListItemIcon,
  IconButton
} from "@material-ui/core";
import { Waypoint } from "react-waypoint";

import {
  useBooksQuery,
  useRemoveBookMutation,
  BooksQuery,
  BooksDocument
} from "../generated/ApolloHooks";
import "../App.css";

const Books = () => {
  // implement fetch more
  const { data, fetchMore, networkStatus } = useBooksQuery({
    variables: { first: 50 },
    notifyOnNetworkStatusChange: true
  });

  const removeBook = useRemoveBookMutation();

  if (!data || !data.books) {
    // also implementing as network status check
    return <CircularProgress />;
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
                <ListItem>
                  <ListItemText>{x.title}</ListItemText>
                </ListItem>
                <ListItemIcon>
                  <IconButton
                    onClick={() =>
                      removeBook({
                        variables: { id: x.id },
                        update: (store) => {
                          const data = store.readQuery<BooksQuery>({
                            query: BooksDocument
                          });
                          store.writeQuery<BooksQuery>({
                            query: BooksDocument,
                            data: {
                              books: {
                                __typename: "BooksResponse",
                                books: data!.books.books.filter(
                                  (y) => y.id !== x.id
                                ),
                                hasNextPage: data!.books.hasNextPage
                              }
                            }
                          });
                        }
                      })
                    }
                  />
                </ListItemIcon>

                {/* when 10 items away from the bottom and visible -> fetch more -> Waypoint */}
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
          {/* on scroll -> check apollo dev tools */}
          {networkStatus === 3 && <CircularProgress />}
        </Paper>
      </div>
    </div>
  );
};

export default Books;
