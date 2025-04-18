import { useEffect } from "react";

const Home = () => {

  const callGroq = async () => {
    try {
      const res = await fetch("/api/server", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "HI" }),
      });
      if (res.status === 200) {
        const data = await res.json();
        console.log("Groq Response:", data.reply);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callGroq();
  }, []);

  return <>Home</>;
};

export default Home;
