import axios from "axios";
import { backend_url } from "./const";
import { Comment, Data } from "../App";



const client = axios.create({
    baseURL: backend_url,

})


export const getVideoUrl: () => Promise<string>  = async () => {
    const res = await client.get("/get_video_url");
    return res.data;
}


export const increaseView = async () => {
    await client.get("/increase_view");
}


export const getData: () => Promise<Data> = async () => {
    const res = await client.get("/get_data");
    const data: string[][] = res.data;
    const comments: Comment[] = []
    for (let i = data.length - 1; i >= 2; i--) {
        const [name, time, content] = data[i];
        comments.push({name, time, content});
    }
    const output:Data = {
        totalView: data[1][1],
        toDayView: data[0][1],
        comments
    }
    return output;
}

export const addNewComment = async (comment: Comment) => {
    const res = await client.post("/add_comment", comment)
    return res;
}