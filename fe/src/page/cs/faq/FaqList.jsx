import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { Modal } from "../../../components/root/Modal.jsx";
import axios from "axios";
import { AuthenticationContext } from "../../../components/context/AuthenticationProvider.jsx";
import { HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../../components/ui/pagination.jsx";

function FaqList(props) {
  const [faqList, setFaqList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState();
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    type: searchParams.get("type") ?? "all",
    keyword: searchParams.get("key") ?? "",
  });

  const navigate = useNavigate();
  const { isAdmin, hasAccess } = useContext(AuthenticationContext);

  useEffect(() => {
    axios
      .get("/api/cs/faq/list", {
        params: searchParams,
      })
      .then((res) => {
        setFaqList(res.data.faqList);
        setCount(res.data.count);
      })
      .catch((err) => {
        setFaqList([]);
      });
  }, []);

  // 날짜 포맷을 yyyy-MM-dd 형식으로 변환
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  function handleSearchClick() {
    if (search.keyword.trim().length > 0) {
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.set("type", search.type);
      nextSearchParam.set("key", search.keyword);
      setSearchParams(nextSearchParam);
    } else {
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.delete("type");
      nextSearchParam.delete("key");
      setSearchParams(nextSearchParam);
    }
  }

  function handlePageChange(e) {
    const pageNumber = { page: e.page };
    const pageQuery = new URLSearchParams(pageNumber);
    navigate(`/cs/faq/list?${pageQuery.toString()}`);
  }

  return (
    <div className={"faq"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs/index`)}
        depth2={"자주 묻는 질문"}
        navigateToDepth2={() => navigate(`/cs/faq/list`)}
      />

      <div className={"body-normal"}>
        <div className={"btn-wrap"}>
          {isAdmin && hasAccess && (
            <button
              className={"btn btn-dark"}
              onClick={() => setAddModalOpen(true)}
            >
              작성
            </button>
          )}
        </div>

        <div className={"btn-wrap"}>
          <button
            className={"btn btn-dark-outline"}
            onClick={() => navigate("/cs/index")}
          >
            고객센터 홈
          </button>
        </div>

        <h1>자주 묻는 질문</h1>

        {/*검색*/}
        <div className={"search-form"}>
          <select
            value={search.type}
            onChange={(e) => setSearch({ ...search, type: e.target.value })}
          >
            <option value="all">전체</option>
            <option value="all">질문</option>
            <option value="all">답변</option>
          </select>
          <div className={"search-form-input"}>
            <input
              type="search"
              value={search.keyword}
              onChange={(e) =>
                setSearch({ ...search, keyword: e.target.value.trim() })
              }
            />
            <button
              className={"btn-search btn-dark"}
              onClick={handleSearchClick}
            >
              검색
            </button>
          </div>
        </div>

        {!faqList || faqList.length === 0 ? (
          <div className={"empty-container"}>
            <p className={"empty-container-title"}>등록된 FAQ가 없습니다.</p>
          </div>
        ) : (
          <table className={"table-list"}>
            <thead>
              <tr>
                <th>#</th>
                <th>질문</th>
                <th>작성일</th>
              </tr>
            </thead>

            <tbody>
              {faqList.map((faq) => (
                <tr
                  key={faq.id}
                  onClick={() => navigate(`/cs/faq/view/${faq.id}`)}
                >
                  <td>{faq.id}</td>
                  <td>{faq.question}</td>
                  <td>{formatDate(faq.updated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className={"pagination"}>
        <PaginationRoot
          count={count}
          pageSize={10}
          defaultPage={1}
          onPageChange={handlePageChange}
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </div>

      {/* 추가 modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => navigate(`/cs/faq/add`)}
        message="FAQ를 작성하시겠습니까?"
        buttonMessage="작성"
      />
    </div>
  );
}

export default FaqList;
