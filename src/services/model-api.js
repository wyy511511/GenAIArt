import axios from "axios";

// Step 1: Start the image generation task and get the task ID
const startImageGenerationTask = async (promptCall) => {
  const apiKey = process.env.REACT_APP_API_KEY;

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
const fetchImageURL = async (taskID) => {
  const endpoint = 'https://api.midjourneyapi.xyz/mj/v2/fetch';
  let imageUrl = null;

  while (!imageUrl) {
    try {
      const response = await axios.post(endpoint, { task_id: taskID });
      console.log("fetch")
      console.log(response.data)
      if (response.data && response.data.task_result && response.data.task_result.image_url) {
        imageUrl = response.data.task_result.image_url;
        console.log(imageUrl)
        //可以在这里设置一个浏览器弹窗输出image Url吗  
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
