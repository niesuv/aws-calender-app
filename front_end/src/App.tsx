import { useEffect, useState } from "react";
import "./index.css";
import { Loichuc } from "./loichuc";
import "./output.css";
import {
  addNewComment,
  getData,
  getVideoUrl,
  increaseView,
} from "./http/https";
import CommentCard from "./CommentCard";

export interface Comment {
  name: string;
  time: string;
  content: string;
}

export interface Data {
  totalView: string;
  toDayView: string;
  comments: Comment[];
}

function App() {
  const today = new Date();
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const dayOfWeek = daysOfWeek[today.getDay()];
  const loiChuc = Loichuc[today.getDay()];
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const [load, setLoad] = useState<boolean>(false);
  const [commentErr, setCommentErr] = useState<boolean>(false);

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoErr, setVideoErr] = useState<boolean>(false);
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    getVideoUrl()
      .then((s) => {
        setVideoUrl(s);
        setVideoErr(false);
      })
      .catch(() => setVideoErr(true));
  }, []);

  useEffect(() => {
    const lastTimeInc = localStorage.getItem("lastTime");
    const now = new Date();
    if (lastTimeInc !== null) {
      const date = new Date(JSON.parse(lastTimeInc));
      if (
        now.getDate() === date.getDate() &&
        now.getMonth() === date.getMonth() &&
        now.getFullYear() === date.getFullYear()
      ) {
        return;
      }
    }
    localStorage.setItem("lastTime", JSON.stringify(now));
    increaseView()
      .then(() => {
        console.log("success");
      })
      .catch(() => {
        console.log("errr");
      });
  });

  useEffect(() => {
    getData().then((data) => setData(data));
  }, []);
  return (
    <div className="h-full w-full overflow-hidden relative">
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/back.mp4"
      />

      <div className="relative z-10 w-full lg:p-10  p-3 h-full overflow-hidden">
        <div className="h-full w-full flex flex-col content-center items-center">
          <p className="w-full text-3xl px-5  text-center text-white ">
            {`${dayOfWeek} ${day}/${month}/${year}`}
          </p>

          <p className="w-full text-2xl text-yellow-400 text-center">
            {loiChuc}
          </p>

          <p className="w-full text-2xl text-yellow-600 text-center">
            Hôm nay đã có: {data === null ? "...." : data.toDayView} người ghé
            thăm
          </p>

          <p className="w-full text-2xl text-yellow-600 text-center">
            Tổng cộng đã có: {data === null ? "...." : data.totalView} người ghé
            thăm
          </p>

          <p className="w-full text-2xl text-yellow-600 text-center pb-5">
            Video âm nhạc của ngày hôm nay!
          </p>

          {videoErr && (
            <p className="w-full text-2xl text-red-300 text-center pt-5">
              Some error happens
            </p>
          )}

          {videoUrl == "" ? (
            <p className="w-full text-2xl text-yellow-400 text-center">
              Loading....
            </p>
          ) : (
            <iframe
              className="w-full max-w-4xl aspect-video"
              src={videoUrl}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}

          {data !== null &&
            data.comments.map((c) => {
              return (
                <CommentCard
                  comment={c}
                  key={c.name + c.time + Math.random()}
                ></CommentCard>
              );
            })}

          {commentErr && (
            <p className="w-full text-2xl text-red-300 text-center pt-5">
              Some error happens
            </p>
          )}

          <form
            className="flex flex-col gap-2 w-full max-w-5xl items-center"
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const obj = Object.fromEntries(formData);
              const name = obj["name"] as string;
              const content = obj["content"] as string;
              if (name.trim() === "" || content.trim() === "") return;

              const now = new Date();
              const time =
                now.getHours().toString() + ":" + now.getMinutes().toString();
              setLoad(true);
              const newEntry = {
                name,
                content,
                time,
              };
              addNewComment(newEntry)
                .then(() => {
                  setLoad(false);
                  setData((old) => {
                    if (old !== null) {
                      const newComments = [newEntry, ...old.comments];
                      return {
                        ...old,
                        comments: newComments,
                      };
                    }
                    return null;
                  });
                })
                .catch(() => {
                  setLoad(false);
                  setCommentErr(true);
                });
            }}
          >
            <p className="text-white text-2xl text-start w-full">
              <strong>Tên của bạn</strong>
            </p>
            <input
              className="bg-gray-400 w-full rounded-md h-8 px-3"
              type="text"
              name="name"
              id="name"
            />

            <p className="text-white text-2xl text-start w-full">
              <strong>Lời muốn nhắn gửi</strong>
            </p>
            <input
              className="bg-gray-400 w-full rounded-md h-16 px-3 "
              type="text"
              name="content"
              id="content"
            />
            <button
              className="bg-green-400 w-full max-w-5xl py-4 hover:brightness-125 rounded-md mt-4 disabled:bg-gray-500"
              type="submit"
              disabled={load}
            >
              <strong className="text-3xl">Send</strong>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
