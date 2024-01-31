import React, { useState, useEffect } from "react";
import ImageBox from "../components/ImageBox";
import NavBar from "../components/NavBar";
// import { fetchImages } from "../services/model-api";
// // 导入默认导出时不使用花括号
// import generateAndFetchImage from '../services/model-api';
// 在其他文件中
import { fetchImages, generateAndFetchImage } from '../services/model-api';

import { getRandom, loaderMessages, promptIdeas } from "../utilities/utils";
import ChooseResults from "../components/ChooseResults";
import RecentResults from "../components/RecentResults";

const Home = () => {
  const [showLoader1, setShowLoader1] = useState(false);
  const [showLoader2, setShowLoader2] = useState(false);

  const [imageResult1, setImageResult1] = useState(null);
  const [imageResult2, setImageResult2] = useState(null);

  const [promptQuery, setPromptQuery] = useState("");
  const [radioValue, setRadioValue] = useState("20");
  const [dropDownValue, setDropDownValue] = useState("DDIM");
  const [seedValue, setSeedValue] = useState(17123564234);
  const [loaderMessage, setLoaderMessage] = useState(loaderMessages[0]);

  const [useMidjourney, setUseMidjourney] = useState(false);
  const [useStableDiffusion, setUseStableDiffusion] = useState(false);


  useEffect(() => {
    const loaderInterval = setInterval(() => {
      setLoaderMessage(getRandom(loaderMessages));
    }, 3000);
    // to avoid memory leak
    return () => {
      clearInterval(loaderInterval);
    };
  }, [loaderMessage]);

  const handleSearch = (event) => {
    setPromptQuery(event.target.value);
  };

  const handleChange = (event) => {
    if (event.target.name === "radio") {
      setRadioValue(event.target.value);
    } else if (event.target.name === "dropdown") {
      setDropDownValue(event.target.value);
    } else {
      setSeedValue(event.target.value);
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    try {

      if (useMidjourney) setShowLoader1(true);
      if (useStableDiffusion) setShowLoader2(true);
  
      const promises = [];
  

      if (useMidjourney) {
        const promise1 = fetchImages(promptQuery)
          .then((firstImageBlob) => {
            const fileReaderInstance = new FileReader();
            fileReaderInstance.onload = () => {
              const base64data = fileReaderInstance.result;
              setImageResult1(base64data);
              setShowLoader1(false);
            };
            fileReaderInstance.readAsDataURL(firstImageBlob);
          })
          .catch((error) => {
            console.error("Error fetching first image:", error);
            setShowLoader1(false);
          });
  
        promises.push(promise1);
      }
  

      if (useStableDiffusion) {
        const promise2 = generateAndFetchImage(promptQuery)
          .then((secondImageBlob) => {
            const fileReaderInstance = new FileReader();
            fileReaderInstance.onload = () => {
              const base64data = fileReaderInstance.result;
              setImageResult2(base64data);
              setShowLoader2(false);
            };
            fileReaderInstance.readAsDataURL(secondImageBlob);
          })
          .catch((error) => {
            console.error("Error fetching second image:", error);
            setShowLoader2(false);
          });
  
        promises.push(promise2);
      }
  
      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching images from APIs:", error);
      setShowLoader1(false);
      setShowLoader2(false);
    }
  };
  
  

  const handleSurpriseMe = (e) => {
    const surprisePrompt = getRandom(promptIdeas);
    setPromptQuery(surprisePrompt);
  };

  const handleAvailOptions = (option) => {
    setPromptQuery(option);
  };

  return (
    <div>
      <NavBar />
      <div className="surpriseBox">
        <label>ONE Promt, TWO outputs!</label>
      </div>
      <div>
        <input
          type="text"
          id="prompt"
          value={promptQuery}
          onChange={handleSearch}
          placeholder="A plush toy robot sitting against a yellow wall"
          className="promptInput"
        />
        <button onClick={handleSurpriseMe}>Surprise Me</button>
      </div>

      <div className="centeredContainer">
        <div className="formValue">
          <label>
            <input
              type="checkbox"
              checked={useMidjourney}
              onChange={() => setUseMidjourney(!useMidjourney)}
            />
            Midjourney
          </label>
          <label>
            <input
              type="checkbox"
              checked={useStableDiffusion}
              onChange={() => setUseStableDiffusion(!useStableDiffusion)}
            />
            Stable Diffusion
          </label>
        </div>
      </div>

      

      <div>
        <button onClick={handleGenerate}>Generate the Image</button>
      </div>

      {showLoader1 ? (
        <div style={{ margin: 20 }}>Blazing fast for Midjourney ⚡️⚡️⚡️</div>
      ) : (
        <>
          <ImageBox promptQuery={"MidJourney_" + promptQuery} imageResult={imageResult1} />
        </>
      )}

      {showLoader2 ? (
        <div style={{ margin: 20 }}>Blazing fast for Stable Diffusion ⚡️⚡️⚡️</div>
      ) : (
        <>
          <ImageBox promptQuery={"StableDiffusion_" +promptQuery} imageResult={imageResult2} />
        </>
      )}
      <ChooseResults onSelect={handleAvailOptions} />
      {/* <RecentResults
        promptQuery={null}
        imageResult={imageResult}
        onSelect={handleAvailOptions}
      /> */}
      <div className="slideShowMessage">{loaderMessage}</div>
      <div className="footer">GenAI</div>
    </div>
  );
};

export default Home;
