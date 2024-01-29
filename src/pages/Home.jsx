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

  // const fetchData = async () => {
  //   try {
  //     setShowLoader(true);
  
  //     // 并行调用两个 API
  //     const [firstImageBlob, secondImageUrl] = await Promise.all([
  //       fetchImages(promptQuery), // 第一个API调用
  //       fetchSecondImage(promptQuery) // 第二个API调用
  //     ]);
  
  //     // 处理第一个 API 的结果
  //     const fileReaderInstance = new FileReader();
  //     fileReaderInstance.onload = () => {
  //       let base64data = fileReaderInstance.result;
  //       // 处理第一个图像结果
  //     };
  //     fileReaderInstance.readAsDataURL(firstImageBlob);
  
  //     // 直接使用第二个 API 的 URL 结果
  //     // 你可能需要根据你的应用需求来决定如何展示这个图像
  //     console.log('Second Image URL:', secondImageUrl);
  
  //     setShowLoader(false);//进度条 
  //   } catch (error) {
  //     console.error("Error fetching images from APIs:", error);
  //     setShowLoader(false);
  //   }
  // };
  
  const fetchData = async () => {
    setShowLoader1(true);
    setShowLoader2(true);

  
    // 单独处理第一个 API 调用的 Promise
    fetchImages(promptQuery).then(firstImageBlob => {
      // 当第一个 API 调用完成时，处理并展示结果
      const fileReaderInstance = new FileReader();
      fileReaderInstance.onload = () => {
        const base64data = fileReaderInstance.result;
        console.log('First Image Base64:', base64data);
        // 展示第一个图像，例如更新状态或 DOM 元素
      };
      fileReaderInstance.readAsDataURL(firstImageBlob);
      setShowLoader1(false);
    }).catch(error => {
      console.error("Error fetching first image:", error);
    });
  
    // 单独处理第二个 API 调用的 Promise
    generateAndFetchImage(promptQuery).then(secondImageBlob => {
      // 当第二个 API 调用完成时，展示结果
      const fileReaderInstance = new FileReader();
      fileReaderInstance.onload = () => {
        const base64data = fileReaderInstance.result;
        console.log('2 Image Base64:', base64data);
        // 展示第一个图像，例如更新状态或 DOM 元素
      };
      fileReaderInstance.readAsDataURL(secondImageBlob);
      setShowLoader2(false);


      // 展示第二个图像，例如更新状态或 DOM 元素
    }).catch(error => {
      console.error("Error fetching second image:", error);
    });
  
    // 不再使用 Promise.all，这里的 setShowLoader(false) 需要调整
    //考虑需要在两个 API 调用都完成后才隐藏加载指示器
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
        <label>Bring your imaginations into reality!</label>
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
      <div className="formBox">
        <div className="formValue">
          <label>Scheduler &nbsp;</label>
          <select name="dropdown" value={dropDownValue} onChange={handleChange}>
            <option value="Euler">Euler</option>
            <option value="LMS">LMS</option>
            <option value="Heun">Heun</option>
            <option value="DDPM">DDPM</option>
          </select>
        </div>
        <div className="formValue">
          Steps
          <label>
            <input
              type="radio"
              name="radio"
              value="20"
              checked={radioValue === "20"}
              onChange={handleChange}
            />
            20
          </label>
          <label>
            <input
              type="radio"
              name="radio"
              value="30"
              onChange={handleChange}
            />
            30
          </label>
          <label>
            <input
              type="radio"
              name="radio"
              value="50"
              onChange={handleChange}
            />
            50
          </label>
        </div>
        <div className="formValue">
          <label>Seed &nbsp;</label>
          <input
            type="number"
            name="input"
            value={seedValue}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <button onClick={handleGenerate}>Generate the Image</button>
      </div>

      {showLoader1 ? (
        <div style={{ margin: 20 }}>Blazing fast results1... ⚡️⚡️⚡️</div>
      ) : (
        <>
          <ImageBox promptQuery={promptQuery} imageResult={imageResult1} />
        </>
      )}

      {showLoader2 ? (
        <div style={{ margin: 20 }}>Blazing fast results2... ⚡️⚡️⚡️</div>
      ) : (
        <>
          <ImageBox promptQuery={promptQuery} imageResult={imageResult2} />
        </>
      )}
      <ChooseResults onSelect={handleAvailOptions} />
      {/* <RecentResults
        promptQuery={null}
        imageResult={imageResult}
        onSelect={handleAvailOptions}
      /> */}
      <div className="slideShowMessage">{loaderMessage}</div>
      <div className="footer">Powered by SegMind</div>
    </div>
  );
};

export default Home;
