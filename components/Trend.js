import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Item from "./Item";
import styles from "@/styles/List.module.scss";
import { Statusgroup } from "@/context/StatusContext";

const Trend = () => {
  const [trendlist, setTrendlist] = useState();
  const { data } = useContext(Statusgroup);
  const maxTrendLength = 5
  const getTrendlist = async() => {
    let arr = [];
    await axios.get("/api/").then((res) => {
      res.data.sort((a, b) => {
        return b.like_count - a.like_count;
      });
      if(res.data.length > maxTrendLength) {
        for (let i = 0; i < maxTrendLength; i++) {
          arr[i] = res.data[i];
        }
      }else {
        for (let i = 0; i < res.data.length; i++) {
          arr[i] = res.data[i];
        }
      }
      setTrendlist(arr);
    });
  };
  useEffect(() => {
    getTrendlist();
  }, [data]);

  return (
    <div className={styles.listBox}>
      <ul>{trendlist && trendlist.map((obj, key) => <Item obj={obj} key={key}></Item>)}</ul>
    </div>
  );
};

export default Trend;
