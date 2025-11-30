import { useState, useEffect } from "react";
import { HeartIcon, SpinnerIcon } from "./icons";

export default function App() {
  const [liked, setIsLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  async function updateAction() {
    try {
      setIsPending(true);
      setErrMsg("");
      const url =
        "https://questions.greatfrontend.com/api/questions/like-button";
      const headers = {
        "Content-Type": "application.json",
      };
      const method = "POST";
      const body = JSON.stringify({
        action: liked ? "unlike" : "like",
      });

      const response = await fetch(url, {
        method,
        headers,
        body,
      });

      // can fail 50% times
      if (!response.ok) {
        const res = await response.json();
        setErrMsg(res.message);
        return;
      }
      setIsLiked(!liked);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  }

  const likedClsName = liked ? "like-button--liked" : "like-button--default";
  const buttonClsName = `like-button ${likedClsName}`;
  return (
    <div>
      <button
        className={buttonClsName}
        disabled={isPending}
        onClick={() => {
          updateAction();
        }}
      >
        {isPending ? <SpinnerIcon /> : <HeartIcon />}
        {liked ? "Liked" : "Like"}
      </button>
      {errMsg && <div>{errMsg}</div>}
      {/*<button>
        <SpinnerIcon /> Like
      </button>*/}
    </div>
  );
}
