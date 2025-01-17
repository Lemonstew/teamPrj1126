import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Wallet.css";
import { Modal } from "../../components/root/Modal.jsx";
import { Breadcrumb } from "../../components/root/Breadcrumb.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import moment from "moment";
import { WalletCalendar } from "./WalletCalendar.jsx";
import { formatNumberWithCommas } from "../../components/utils/FormatNumberWithCommas.jsx";
import { WalletCategory } from "./WalletCategory.jsx";

function WalletList(props) {
  const [walletList, setWalletList] = useState([]); // 전체 지갑 리스트
  const [currentMonth, setCurrentMonth] = useState(); // 현재 월
  const [currentYear, setCurrentYear] = useState(); // 현재 년도
  const [selectedDate, setSelectedDate] = useState(); // 선택된 날짜
  const [filteredWallet, setFilteredWallet] = useState(walletList); // 필터링된 지갑 리스트
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);
  const [activeTab, setActiveTab] = useState(0); // 카테고리 탭 활성화
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set()); // 체크된 항목 ID 저장
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/wallet/list").then((res) => {
      setWalletList(res.data);

      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const formattedMonth = `${year}년 ${now.toLocaleString("default", {
        month: "long",
      })}`;

      setCurrentMonth(formattedMonth);
      setCurrentYear(year);
      setActiveMonth(month + 1); // 현재 월 설정 (1-12)

      // 현재 월 데이터로 필터링
      const filtered = filterWalletsByMonthAndCategory(
        res.data,
        month,
        year,
        categories[activeTab],
      );
      setFilteredWallet(filtered);
    });
  }, []);

  // currentMonth가 변경될 때마다 필터링된 리스트 업데이트
  useEffect(() => {
    if (walletList.length > 0 && currentMonth) {
      const [year, month] = currentMonth
        .split("년 ")
        .map((str) => str.replace("월", ""));
      const date = new Date(year, month - 1, 1);

      const filtered = walletList.filter((wallet) => {
        const walletDate = new Date(wallet.date);
        return (
          walletDate.getMonth() === date.getMonth() &&
          walletDate.getFullYear() === date.getFullYear()
        );
      });
      setFilteredWallet(filtered);
    }
  }, [currentMonth, walletList]);

  // 선택된 날짜가 변경될 때 필터링
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const filtered = walletList.filter(
        (wallet) => wallet.date === formattedDate,
      );
      setFilteredWallet(filtered);
    } else {
      setFilteredWallet(walletList); // 날짜를 선택하지 않으면 전체 리스트 표시
    }
  }, [selectedDate, walletList]);

  useEffect(() => {
    if (currentMonth) {
      const [year, month] = currentMonth
        .split("년 ")
        .map((str) => str.replace("월", ""));
      const date = new Date(year, month - 1, 1); // currentMonth에서 년도와 월을 파싱하여 Date 객체 생성
      setSelectedDate(date);
    }
  }, [currentMonth]);

  useEffect(() => {
    const now = moment(); // 현재 날짜를 moment로 처리
    const formattedMonth = now.format("YYYY년 M월"); // 이번 달의 포맷
    setCurrentMonth(formattedMonth); // currentMonth 초기값 설정
    setCurrentYear(now.year()); // currentYear 설정

    // 이번 달에 해당하는 데이터 필터링
    const filtered = walletList.filter((wallet) => {
      const walletDate = new Date(wallet.date);
      return (
        walletDate.getMonth() === now.month() &&
        walletDate.getFullYear() === now.year()
      );
    });
    setFilteredWallet(filtered); // 필터링된 데이터를 상태에 저장
  }, [walletList]);

  const handleMonthClick = (monthNumber) => {
    setActiveMonth(monthNumber);
    const newMonth = moment(`${currentYear}-${monthNumber}`, "YYYY-M");
    const formattedMonth = newMonth.format("YYYY년 M월");
    setCurrentMonth(formattedMonth);
    setSelectedDate(null); // 선택된 날짜 초기화

    // 직접 필터링 로직 실행
    const filtered = walletList.filter((wallet) => {
      const walletDate = new Date(wallet.date);
      return (
        walletDate.getMonth() === monthNumber - 1 && // JavaScript의 month는 0-based
        walletDate.getFullYear() === currentYear
      );
    });

    // 카테고리 필터링 추가
    if (categories[activeTab] && categories[activeTab] !== "전체") {
      const categoryFiltered = filtered.filter(
        (wallet) => wallet.category === categories[activeTab],
      );
      setFilteredWallet(categoryFiltered);
    } else {
      setFilteredWallet(filtered);
    }
  };

  // 이번 달 보기
  const handleMonthView = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const formattedMonth = `${year}년 ${now.toLocaleString("default", {
      month: "long",
    })}`;

    setCurrentMonth(formattedMonth);
    setCurrentYear(year);
    setActiveMonth(month + 1);

    const filtered = filterWalletsByMonthAndCategory(
      walletList,
      month,
      year,
      categories[activeTab],
    );
    setFilteredWallet(filtered);
  };

  // 전체 보기
  const handleAllView = () => {
    setActiveMonth(null); // 월 탭 활성화 제거
    setFilteredWallet(walletList);
  };

  // 필터링 유틸리티 함수
  const filterWalletsByMonthAndCategory = (wallets, month, year, category) => {
    let filtered = wallets.filter((wallet) => {
      const walletDate = new Date(wallet.date);
      return (
        walletDate.getMonth() === month && walletDate.getFullYear() === year
      );
    });

    if (category && category !== "전체") {
      filtered = filtered.filter((wallet) => wallet.category === category);
    }

    return filtered;
  };

  // 년도 별로 보기
  const handleYearView = () => {
    const filtered = walletList.filter((wallet) => {
      const walletDate = new Date(wallet.date);
      return walletDate.getFullYear() === currentYear; // 현재 연도만 필터링
    });
    setFilteredWallet(filtered);
  };

  // 서버에서 카테고리 받아오기
  const categories = useMemo(() => {
    const categories = walletList.map((wallet) => wallet.category);
    return ["전체", ...new Set(categories)]; // "전체" 추가 및 중복 제거
  }, [walletList]);

  // 카테고리별 지출 합계 계산
  const calculateCategoryTotalExpense = (category) => {
    if (category === "전체") {
      return filteredWallet.reduce(
        (total, wallet) => total + wallet.expense,
        0,
      );
    } else {
      return filteredWallet
        .filter((wallet) => wallet.category === category)
        .reduce((total, wallet) => total + wallet.expense, 0);
    }
  };

  // 카테고리 탭 활성화
  const handleTabClick = (index) => {
    setActiveTab(index);
    setSelectedDate(null);

    const [year, month] = currentMonth
      .split("년 ")
      .map((str) => str.replace("월", ""));
    const currentMonthDate = new Date(year, parseInt(month) - 1);

    const filtered = filterWalletsByMonthAndCategory(
      walletList,
      currentMonthDate.getMonth(),
      currentMonthDate.getFullYear(),
      categories[index],
    );
    setFilteredWallet(filtered);
  };

  const isCategoryFiltered = activeTab !== 0; // "전체"가 아닌 카테고리가 선택되었을 때만 tfoot 표시

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (checkedItems.size === filteredWallet.length) {
      setCheckedItems(new Set()); // 전체 해제
    } else {
      setCheckedItems(new Set(filteredWallet.map((wallet) => wallet.id))); // 전체 선택
    }
  };

  // 선택된 항목 삭제
  const handleDeleteSelectedItems = () => {
    const selectedIds = [...checkedItems];

    axios
      .delete("/api/wallet/delete", {
        data: selectedIds,
      })
      .then((res) => {
        const { type, text } = res.data.message;

        setWalletList((prevList) =>
          prevList.filter((wallet) => !selectedIds.includes(wallet.id)),
        );
        setFilteredWallet((prevList) =>
          prevList.filter((wallet) => !selectedIds.includes(wallet.id)),
        );
        setCheckedItems(new Set()); // 삭제 후 체크된 항목 해제

        setDeleteModalOpen(false);

        toaster.create({
          type: type,
          description: text,
        });
      })
      .catch((error) => {
        const { type, text } = error.data.message;

        toaster.create({
          type: type,
          description: text,
        });
      });
  };

  // 날짜에 따른 지출 합산 (selectedDate 변경 시 )
  const calculateTotal = (type) => {
    const filtered = selectedDate
      ? walletList.filter((wallet) => {
          const walletDate = new Date(wallet.date);
          return (
            walletDate.getMonth() === selectedDate.getMonth() &&
            walletDate.getFullYear() === selectedDate.getFullYear()
          );
        })
      : walletList;

    return filtered.reduce((total, wallet) => total + wallet[type], 0);
  };

  // 총 지출 계산 (전체 지갑 리스트 기준)
  const getTotalExpense = useMemo(
    () => calculateTotal("expense"),
    [walletList, selectedDate],
  );

  // 총 수입 계산 (전체 지갑 리스트 기준)
  const getTotalIncome = useMemo(
    () => calculateTotal("income"),
    [walletList, selectedDate],
  );

  // 해당 하는 날짜의 일별 수입 계산
  const getOneDayIncome = () => {
    return filteredWallet.reduce((total, wallet) => total + wallet.income, 0);
  };

  // 해당 하는 날짜의 일별 지출 계산
  const getOneDayExpense = () => {
    return filteredWallet.reduce((total, wallet) => total + wallet.expense, 0);
  };

  // 선택된 항목의 소비액 합계
  const getTotalSelectedExpense = useMemo(() => {
    return [...checkedItems].reduce((total, id) => {
      const wallet = walletList.find((item) => item.id === id);
      return total + (wallet ? wallet.expense : 0);
    }, 0);
  }, [checkedItems, walletList]);

  // 해당 하는 날짜
  const getFilteredDate = () => {
    if (filteredWallet.length > 0) {
      const date = new Date(filteredWallet[0].date); // 첫 번째 항목의 날짜를 Date 객체로 변환
      const year = date.getFullYear(); // 연도
      const month = date.getMonth() + 1; // 월 (0부터 시작하므로 1을 더함)
      const day = date.getDate(); // 일
      return `${year}년 ${month}월 ${day}일`; // 원하는 형식으로 반환
    }

    // filteredWallet이 비어 있을 경우, selectedDate를 사용해 날짜 출력
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();
      return `${year}년 ${month}월 ${day}일`; // selectedDate를 기준으로 날짜 반환
    }

    return ""; // 필터링된 리스트가 없고 selectedDate도 없다면 빈 문자열 반환
  };

  return (
    <div className={"wallet"}>
      <Breadcrumb
        depth1={"내 지갑"}
        navigateToDepth1={() => navigate(`/wallet/list`)}
      />

      <WalletCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
        walletList={walletList}
      />

      <div className={"middle-section"}>
        <h1>내 지갑</h1>

        <div className={"category-table"}>
          <table>
            <caption>
              <p className={"highlight"}>{currentMonth}</p>
            </caption>

            <tr>
              <th>총 지출</th>
              <td>{formatNumberWithCommas(getTotalExpense)}</td>
              <td>원</td>
            </tr>
          </table>
        </div>

        <WalletCategory
          filteredWallet={filteredWallet}
          walletList={walletList}
          categories={categories}
          getFilteredDate={getFilteredDate}
          selectedDate={selectedDate}
          currentMonth={currentMonth}
        />
      </div>

      <div className={"right-section"}>
        <div className={"btn-wrap fixed-list-head-wrap"}>
          <button
            className={"btn btn-dark"}
            onClick={() => setAddModalOpen(true)}
          >
            추가
          </button>

          <button
            className={"btn btn-dark-outline"}
            style={{ marginLeft: "15px" }}
            onClick={handleAllView}
          >
            전체 내역 보기
          </button>

          <button
            className={"btn btn-dark-outline"}
            style={{ marginLeft: "15px" }}
            onClick={handleMonthView}
          >
            이번 달
          </button>

          <button
            className={"btn btn-warning"}
            onClick={() => setDeleteModalOpen(true)}
            style={{
              marginLeft: "15px",
              display: checkedItems.size > 0 ? "inline-block" : "none",
            }}
          >
            선택 항목 삭제
          </button>

          {checkedItems.size > 0 && (
            <div className={"total-expense-wrap"}>
              <p className={"font-bold"}>선택한 지출 합계</p>
              <p>{getTotalSelectedExpense.toLocaleString()}</p>
            </div>
          )}
        </div>

        <div className="month-tab">
          <ul>
            <li
              className={activeMonth === null ? "active" : ""}
              onClick={handleYearView}
            >
              {currentYear}
            </li>
            {Array.from({ length: 12 }, (_, index) => (
              <li
                key={index}
                className={activeMonth === index + 1 ? "active" : ""}
                onClick={() => handleMonthClick(index + 1)}
              >
                {index + 1}월
              </li>
            ))}
          </ul>
        </div>

        <h1 className={"month-title"}>{currentMonth}</h1>

        <div className={"category-tab"}>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className={`category-tab ${activeTab === index ? "on" : ""}`}
                onClick={() => {
                  handleTabClick(index);
                }} // 탭 클릭 시 해당 인덱스를 설정
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        <table className={"table-list table-total-wrap"}>
          <thead>
            <tr>
              <th>총 수입</th>
              <td>{formatNumberWithCommas(getTotalIncome)}</td>
            </tr>

            <tr>
              <th>총 지출</th>
              <td>{formatNumberWithCommas(getTotalExpense)}</td>
            </tr>
          </thead>
        </table>

        <table className={"table-list wallet-list"}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={checkedItems.size === filteredWallet.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>날짜</th>
              <th>항목</th>
              <th>사용처</th>
              <th>수입</th>
              <th>지출</th>
              <th>지출 방식</th>
            </tr>
          </thead>
          {filteredWallet.length === 0 ? (
            <td colSpan={8} className={"empty-container"}>
              <p
                className={"empty-container-description"}
                style={{ margin: "40px 0" }}
              >
                해당하는 날짜에는 내역이 없습니다.
              </p>
            </td>
          ) : (
            <tbody>
              {filteredWallet.map((wallet) => (
                <tr
                  key={wallet.id}
                  onClick={() => navigate(`/wallet/view/${wallet.id}`)}
                  className={checkedItems.has(wallet.id) ? "checked-row" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedItems.has(wallet.id)}
                      onChange={() => handleCheckboxChange(wallet.id)}
                      onClick={(e) => e.stopPropagation()}
                      className={checkedItems.has(wallet.id)}
                    />
                  </td>
                  <td>{wallet.date}</td>
                  <td>{wallet.category}</td>
                  <td>{wallet.title}</td>
                  <td>{formatNumberWithCommas(wallet.income)}</td>
                  <td>{formatNumberWithCommas(wallet.expense)}</td>
                  <td>{wallet.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          )}

          {/* 전체 보기 상태가 아닐 때만 tfoot 렌더링 */}
          {filteredWallet.length !== walletList.length &&
            !isCategoryFiltered && (
              <tfoot className={"table-total-wrap"}>
                <tr>
                  <th colSpan={4}>합계</th>
                  <td colSpan={1}>
                    {formatNumberWithCommas(getOneDayIncome())}
                  </td>
                  <td colSpan={1}>
                    {formatNumberWithCommas(getOneDayExpense())}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}

          {/* 카테고리별 합계가 필터링된 경우에만 표시 */}
          {isCategoryFiltered && (
            <tfoot className={"table-total-wrap"}>
              <tr>
                <th colSpan={4}>{categories[activeTab]} 지출 합계</th>
                <td colSpan={4}>
                  {formatNumberWithCommas(
                    calculateCategoryTotalExpense(categories[activeTab]),
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* 추가 modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => navigate(`/wallet/add`)}
        message="내역을 추가하시겠습니까?"
        buttonMessage="추가"
      />

      {/* 삭제 modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteSelectedItems}
        message="선택된 내역을 삭제하시겠습니까?"
        buttonMessage="삭제"
      />
    </div>
  );
}

export default WalletList;
