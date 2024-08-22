import React, { useEffect, useState } from "react";
import Apiservice, { marvelUrls } from "../ApiService/Apiservice";
import { Card } from "./Card";
import { Link } from "react-router-dom";

export const Main = () => {
  const [item, setItem] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(0); // Track the total pages

  const fetchMarvelCharacters = async (url, prefetch = false) => {
    if (!prefetch) setLoading(true);
    try {
      const response = await Apiservice.GetApiCall(url);
      if (response.status === 200) {
        const results = response.data.data.results;
        setItem(results);
        const totalItems = response.data.data.total;
        setTotalPages(Math.ceil(totalItems / 20)); // Calculate total pages

        // Prefetch next page if there is one
        if (page < totalPages && !prefetch) {
          const nextPageUrl = `${
            marvelUrls.FETCH_CHARACTERS
          }?ts=1&apikey=2e1cdeec426ae323484f29024084c206&hash=d516513ba95b9407c7aca0f73b241f8a&offset=${
            page * 20
          }`;
          fetchMarvelCharacters(nextPageUrl, true); // Prefetch next page data
        }
      }
    } catch (error) {
      console.error("Error fetching Marvel characters:", error);
    } finally {
      if (!prefetch) setLoading(false);
    }
  };

  useEffect(() => {
    const initialUrl = `${
      marvelUrls.FETCH_CHARACTERS
    }?ts=1&apikey=2e1cdeec426ae323484f29024084c206&hash=d516513ba95b9407c7aca0f73b241f8a&offset=${
      (page - 1) * 20
    }`;
    fetchMarvelCharacters(initialUrl);
  }, [page]);

  const searchMarvel = (e) => {
    if (e.key === "Enter") {
      const searchUrl = `${
        marvelUrls.FETCH_CHARACTERS
      }?nameStartsWith=${search}&ts=1&apikey=2e1cdeec426ae323484f29024084c206&hash=d516513ba95b9407c7aca0f73b241f8a&offset=${
        (page - 1) * 20
      }`;
      fetchMarvelCharacters(searchUrl);
    }
  };

  return (
    <>
      <div className="header">
        <div className="bg">
          <img src="./Images/bg1.png" alt="" />
        </div>
        <div className="search-bar">
          <img src="./Images/logo.jpg" alt="logo" />
          <input
            type="search"
            placeholder="Search Here"
            className="search"
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={searchMarvel}
          />
          {loading && <span className="loading"></span>}
        </div>
        <div className="favorites-link-container  ">
          <Link to="/events" className="favorites-link">
            Marvel Event Timeline
          </Link>{" "}
          <Link to="/favorites" className="favorites-link">
            View Favorites
          </Link>
        </div>
        {/* <div className=" ">
          <Link to="/events" className="link event-timeline">
            Marvel Event Timeline
          </Link>
        </div> */}
      </div>
      <div className="content">
        {loading ? (
          <p>Loading...</p>
        ) : !item.length ? (
          <p>Not Found</p>
        ) : (
          <Card data={item} />
        )}
      </div>
      <div className="pagination">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};
