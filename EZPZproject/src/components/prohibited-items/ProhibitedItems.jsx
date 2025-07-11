import { useEffect, useState } from "react";
import axios from "axios";
import "./ProhibitedItems.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// 아이콘 및 설명 설정
const CATEGORY_ICONS = {
  화학물질: "🧪",
  "고위험 비행편": "✈️",
  "액체/겔": "💧",
  "폭발/인화성": "💥",
  화기류: "🔫",
  날붙이: "🔪",
  둔기: "🔨",
};

const CATEGORY_DESCRIPTIONS = {
  날붙이:
    "칼, 송곳, 도끼, 드릴날, 가위, 면도칼,\n 작살 기내 반입이 제한됩니다.",
  둔기: "둔탁한 물건이나 도구는 기내 반입이 제한됩니다.",
  화기류: "모든 종류의 화기 및 무기류는 기내 반입이 절대 금지됩니다.",
  화학물질: "인체에 해롭거나 위험한 화학물질은 기내 반입이 제한됩니다.",
  "폭발/인화성": "폭발성 또는 인화성 물질은 기내 반입이 절대 금지됩니다.",
  "액체/겔": "100ml 이하의 용기에 담긴 액체만 기내 반입이 가능합니다.",
  "고위험 비행편":
    "항공보안 등급 경계경보(Orange) 단계 이상 시 추가 제한이 적용됩니다.",
};

const ALLOWED_ITEMS = {
  전자기기: {
    icon: "📱",
    description: "휴대폰, 노트북 등 개인 전자기기는 기내 반입이 가능합니다.",
    items: ["휴대폰", "노트북", "태블릿", "카메라", "보조배터리(160Wh 미만)"],
  },
  의료용품: {
    icon: "💊",
    description: "처방전이 있는 의약품과 의료기기는 기내 반입이 가능합니다.",
    items: ["처방약", "의료기기", "휠체어", "인슐린", "응급약품"],
  },
  개인용품: {
    icon: "👜",
    description: "필수 개인용품은 규정에 맞게 기내 반입이 가능합니다.",
    items: ["의류", "세면도구", "도서", "음식물(고체)", "유아용품"],
  },
};

// 카테고리와 gubun 매핑
const CATEGORY_TO_GUBUN = {
  날붙이: "끝이 뾰족한 무기및 날카로운 물체",
  둔기: "둔기",
  화기류: "화기류, 총기류,무기류",
  화학물질: "화학물질 및 유독성 물질",
  "폭발/인화성": "폭발물과 인화성 물질",
  "액체/겔": "액체/겔(gel)류 물질",
  "고위험 비행편":
    "국토해양부장관이 지정한 고위험이 예상되는 비행편 또는 항공보안 등급 경계경보(Orange) 단계이상",
};

// 카테고리 그룹
const CATEGORY_GROUPS = {
  신체상해류: ["날붙이", "둔기", "화기류"],
  기내허가류: ["전자기기", "의료용품", "개인용품"],
  인체유해류: ["화학물질", "폭발/인화성", "액체/겔"],
};

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ProhibitedItems() {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAllowedCategory, setSelectedAllowedCategory] = useState(null);
  const [isAllowedModalOpen, setIsAllowedModalOpen] = useState(false);

  // API 호출: 금지 물품 데이터, 공항 목록
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL+"/api/prohibit-items")
      .then((response) => {
        setItemsData(response.data);
      })
      .catch((error) => console.error("API 요청 오류:", error));
  }, []);

 

  // 카테고리 모달 오픈/닫기 함수
  const openModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openAllowedModal = (category) => {
    setSelectedAllowedCategory(category);
    setIsAllowedModalOpen(true);
  };

  const closeAllowedModal = () => {
    setIsAllowedModalOpen(false);
  };

  // 선택된 카테고리에 해당하는 금지 물품 필터링
  const filteredItems = itemsData.filter(
    (item) => item.gubun === selectedCategory
  );

  return (
    <div
      className="prohibited-items"
      style={{ maxWidth: "1200px", maxHeight: "120%", padding: "0 0px" }}
    >
      <div className="description-section2">
        <h1>항공기 반입 금지물품</h1>
        <p className="checklist-alert">
          항공 안전을 위한 기내 반입 가능/금지 물품 목록입니다.
        </p>
      </div>

      <div className="all-categories">
        {Object.entries(CATEGORY_GROUPS).map(([groupName, categories]) => (
          <div
            key={groupName}
            className={`category-column ${
              groupName === "신체상해류"
                ? "physical"
                : groupName === "인체유해류"
                ? "hazardous"
                : "allowed"
            }`}
          >
            <div className="category-title">{groupName}</div>
            {categories.map((category, index) => (
              <div
                key={index}
                className="card"
                onClick={() => {
                  if (groupName === "기내허가류") {
                    openAllowedModal(category);
                  } else {
                    openModal(CATEGORY_TO_GUBUN[category]);
                  }
                }}
              >
                <div className="card-header">
                  <span className="icon">
                    {groupName === "기내허가류"
                      ? ALLOWED_ITEMS[category].icon
                      : CATEGORY_ICONS[category]}
                  </span>
                </div>
                <div className="card-body">
                  <p>
                    <strong>{category}</strong>
                    {groupName === "기내허가류"
                      ? ALLOWED_ITEMS[category].description
                      : CATEGORY_DESCRIPTIONS[category]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 카테고리별 상세정보 모달 */}
      {isModalOpen && selectedCategory && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ✖
            </button>
            <h2>{selectedCategory}</h2>
            <table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>금지 물품</th>
                  <th>기내 반입 여부</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.carryBan}</td>
                      <td>{item.cabin === "Y" ? "허용" : "금지"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">데이터가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isAllowedModalOpen && selectedAllowedCategory && (
        <div className="modal-overlay" onClick={closeAllowedModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeAllowedModal}>
              ✖
            </button>
            <h2>{selectedAllowedCategory}</h2>
            <p>{ALLOWED_ITEMS[selectedAllowedCategory].description}</p>
            <table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>아이템명</th>
                  <th>기내 반입 여부</th> {/* ✅ 기내 반입입 여부 컬럼 추가 */}
                </tr>
              </thead>
              <tbody>
                {ALLOWED_ITEMS[selectedAllowedCategory].items.map(
                  (item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item}</td>
                      <td>허가</td> {/* ✅ 허가 여부 O 표시 */}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProhibitedItems;
