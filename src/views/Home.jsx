import React, { useEffect, useMemo, useState } from "react";
import { Posts } from "../components";
import apiInstance from "../api/base";
import { useLayoutStore } from "../store/store";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState({ posts: [] });
  const [error, setError] = useState(null);
  const { setLoading } = useLayoutStore((state) => state);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsInObject = useMemo(() => {
    return Object.assign(
      {},
      [...searchParams.entries()].reduce(
        (o, [key, value]) => ({ ...o, [key]: value }),
        {}
      ),
      {}
    );
  }, [searchParams]);

  const fetchPosts = async () => {
    setLoading(true);
    await apiInstance
      .get("/posts/", {
        params: {
          page: searchParams.get("page"),
          limit: 3,
          ...searchParamsInObject
        },
      })
      .then(({ data }) => {
        setData(data);
        setTotalPages(data?.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        setError(
          "Something Went Wrong\nPlease try again after sometimes later."
        );
      });
  };

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  if (error)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "36vh" }}
      >
        <div className="text-danger text-center">
          <pre>{error}</pre>
        </div>
      </div>
    );

  return (
    <>
      <Posts posts={data?.posts} />

      <ReactPaginate
        breakLabel="..."
        nextLabel=">>"
        onPageChange={(data) => setSearchParams({ page: data.selected + 1 })}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        previousLabel="<<"
        renderOnZeroPageCount={null}
        containerClassName="pagination d-flex justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName={`page-item`}
        nextClassName="page-item"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        activeClassName="active"
      />
    </>
  );
};

export default Home;
