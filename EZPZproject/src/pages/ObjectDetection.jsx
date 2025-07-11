import axios from "axios";
import { useRef, useState } from "react";
import "./ObjectDetection.css"

const ObjectDetection = () =>{
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const modalImg = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  const handleObjectDetection = async (event) =>{
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(process.env.REACT_APP_API_URL+"/api/odimg", 
        formData,
        {header:{"Content-Type":"multipart/form-data"}}
      );
      console.log(response.data);
      const detectedObjects = response.data || [];
      drawBoundingBoxes(detectedObjects,reader.result);
      // openModal(true);
    }
  }
  const drawBoundingBoxes = (detectedObjects, readerImg) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = readerImg;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      detectedObjects.forEach((obj) => {
        const vertices = obj.vertexList;
        if (vertices.length === 4) {
          const x = vertices[0].x * img.width;
          const y = vertices[0].y * img.height;
          const width = (vertices[1].x - vertices[0].x) * img.width;
          const height = (vertices[2].y - vertices[0].y) * img.height;

          ctx.strokeStyle = "red";
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);

          ctx.fillStyle = "red";
          ctx.font = "16px Arial";
          ctx.fillText(obj.name, x, y - 5);
        }
      });
      
    };
  };
  const closeModal = () => {
    modalImg.current.style.display="none"; // 모달 닫기
  };
  const openModal = () => {
    modalImg.current.style.display="flex"; // 모달 닫기
  };
  return(
    <div>
      <div className="ObjectDetection">
        <div>
          <input type="file" ref={fileInputRef} accept="image/*" onChange={handleObjectDetection} style={{display:'none'}}/>
          <button className="add-btn" onClick={()=>(fileInputRef.current.click())}>
            Detect Objects
          </button>
        </div>
        <div className="detection-result" onClick={(e)=>e.stopPropagation()}>
          <canvas ref={canvasRef} className="detection-image" />
        </div>
      </div>
      {/* <div ref={modalImg} className="modal-overlay" onClick={closeModal}>
        <div className="modal-img" onClick={(e)=>e.stopPropagation()}>
          <canvas ref={canvasRef} className="modal-image" />
        </div>
      </div> */}
    </div>
  );
}
export default ObjectDetection;