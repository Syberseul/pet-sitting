import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    const test = async () => {
      const res = await axios.get("http://localhost:3000/");
      console.log(res.data);
    };

    test();
  }, []);

  return <>123</>;
}

export default App;
