import React from "react";
import { useLoader } from "../assets/LoaderContext";
import "../componentStyle/GlobalLoader.css"; 

const GlobalLoader = () => {
  const { loading } = useLoader();

  return loading ? (
    <div className="global-loader">
      <div className="spinner" />
    </div>
  ) : null;
};

export default GlobalLoader;

