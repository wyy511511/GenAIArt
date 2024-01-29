import React, { useEffect, useState } from "react";
import historyIcon from "../images/history.png";

const RecentResults = (props) => {
  const [recentImagesStored, setRecentImagesStored] = useState([]);

  useEffect(() => {
    console.log("RecentResults useEffect triggered");
    try {
      console.log("Attempting to retrieve data from localStorage");
      const recentImagesString = localStorage.getItem("genAIRecentKey");
      const recentImages = recentImagesString ? JSON.parse(recentImagesString) : null;

      if (recentImages) {
        console.log("Recent images found in localStorage", recentImages);
        setRecentImagesStored(recentImages);
      }

      if (props.promptQuery && props.imageResult) {
        console.log("Processing new prompt and image result");
        const updatedRecentImages = recentImages ? [...recentImages] : [];

        if (!updatedRecentImages.some((local) => local.src === props.imageResult)) {
          if (updatedRecentImages.length === 5) {
            console.log("Maximum recent images stored, removing the oldest");
            updatedRecentImages.shift(); // 移除最早的记录
          }
          updatedRecentImages.push({
            src: props.imageResult,
            name: props.promptQuery,
          });

          console.log("Updating localStorage with new recent images");
          localStorage.setItem("genAIRecentKey", JSON.stringify(updatedRecentImages));
          setRecentImagesStored(updatedRecentImages);
        }
      }
    } catch (error) {
      console.error("Error handling recent results:", error);
    }
  }, [props.promptQuery, props.imageResult]);

  const handleClick = (value) => {
    console.log("Recent image clicked", value);
    props.onSelect(value);
  };




  return (
    <>
      {recentImagesStored.length > 0 ? (
        <>
          <div style={{ marginTop: 30 }}>
            Recent <img src={historyIcon} width={15} height={15} />{" "}
          </div>
          <div className="recentImageBox">
            {recentImagesStored.map((value) => (
              <>
                <div key={value.src} onClick={() => handleClick(value.name)}>
                  <img
                    className="recentImage"
                    src={value.src}
                    alt={value.name}
                    loading="lazy"
                  />
                  <div className="imageLabel">{value.name}</div>
                </div>
              </>
            ))}
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default RecentResults;
