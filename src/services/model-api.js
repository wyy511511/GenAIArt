import axios from "axios";
import React from 'react';
// Step 1: Start the image generation task and get the task ID



const startImageGenerationTask = async (promptCall) => {
  //const apiKey = '42e202e465f4b8bf6c573575a8b5ecb74e1f7025868edf7c3386a329efd17933'
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey)

  const options = {
    headers: {
      "X-API-KEY": apiKey,
    },
    data: {
      "prompt": promptCall,
      // "aspect_ratio": "4:3", // Adjust according to your needs
      // "process_mode": "mixed", // Adjust according to your needs
    },
    url: "https://api.midjourneyapi.xyz/mj/v2/imagine",
    method: 'post'
  };

  try {
    const response = await axios(options);
    console.log(response.data)
    return response.data.task_id; // Assuming the response includes a task_id
  } catch (error) {
    console.error(`Error starting image generation task: ${error}`);
    throw error;
  }
};



// Step 2: Poll the fetch API using the task ID until the image URL is available
export const fetchImageURL = async (taskID) => {
  const endpoint = 'https://api.midjourneyapi.xyz/mj/v2/fetch';
  let imageUrl = null;

  while (!imageUrl) {
    try {
      const response = await axios.post(endpoint, { task_id: taskID });
      console.log("fetch")
      console.log(response.data)
      if (response.data && response.data.task_result && response.data.task_result.image_url) {
        imageUrl = response.data.task_result.image_url;
      } else {
        // Wait for some time before polling again
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
      }
    } catch (error) {
      console.error(`Error fetching image URL: ${error}`);
      throw error;
    }
  }

  return imageUrl;
};

// Step 3: Download the image from the URL and convert it to ArrayBuffer
const downloadImageAsArrayBuffer = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    return response.data; // The image in ArrayBuffer format
  } catch (error) {
    console.error(`Error downloading image: ${error}`);
    throw error;
  }
};

// Combine the steps in the fetchImages function
export const fetchImages = async (promptCall) => {
  try {
    const taskID = await startImageGenerationTask(promptCall);
    const imageUrl = await fetchImageURL(taskID);
    const imageArrayBuffer = await downloadImageAsArrayBuffer(imageUrl);
    return new Blob([imageArrayBuffer], { type: "image/jpeg" }); // Convert ArrayBuffer to Blob
  } catch (error) {
    console.error(`Error in fetchImages function: ${error}`);
    throw error;
  }
};



//second for stable diffusion 

const startImageGeneration = async (promptCall) => {
  const apiKey = process.env.REACT_APP_API_KEY; 
  const options = {
    method: 'post',
    url: "https://api.midjourneyapi.xyz/sd/txt2img",
    headers: {
      "X-API-KEY": apiKey,
    },
    data: {
      "model_id": "midjourney",
      "prompt": promptCall,
      // consider other parameters
    }
  };

  try {
    const response = await axios(options);
    console.log(response.data);
    return response.data.id; 
  } catch (error) {
    console.error(`Error starting image generation: ${error}`);
    throw error;
  }
};


const fetchImageURLWithID = async (id) => {
  const endpoint = "https://api.midjourneyapi.xyz/sd/fetch";
  let imageUrl = null;

  while (!imageUrl) {
    try {
      const response = await axios.post(endpoint, { id }, {
        headers: { "X-API-KEY": process.env.REACT_APP_API_KEY }
      });

      console.log(response.data);
      if (response.data && response.data.output && response.data.output.length > 0) {
        imageUrl = response.data.output[0]; 
        break; // 退出循环
      } else {
        // 如果还没有图像 URL，等待两秒后再次尝试
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Error fetching image URL with ID: ${error}`);
      throw error;
    }
  }

  return imageUrl; // 返回获取到的图像 URL
};


export const generateAndFetchImage = async (promptCall) => {
  try {
    const id = await startImageGeneration(promptCall); // 启动图像生成并获取 ID
    const imageUrl = await fetchImageURLWithID(id); // 使用 ID 获取图像 URL
    console.log(imageUrl); // 处理或显示图像 URL
  } catch (error) {
    console.error(`Error in generateAndFetchImage: ${error}`);
  }
};

// 使用示例

