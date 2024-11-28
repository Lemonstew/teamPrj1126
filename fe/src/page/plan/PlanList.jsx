import React, { useEffect, useState } from "react";
import { Badge, Box, Card, HStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

function PlanList(props) {
  const [planList, setPlanList] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/plan/list", {
        params: searchParams,
      })
      .then((res) => res.data)
      .then((data) => {
        setPlanList(data.list);
        setCount(data.count);
      });
  }, [searchParams]);

  const closeModal = () => {
    setAddModalOpen(false);
  };

  // pagination
  // page 번호 (searchParams : URL 쿼리 파라미터 관리)
  const pageParam = searchParams.get("page") ?? "1";
  // 문자열로 가져온 page 값을 숫자 타입으로 변환
  const page = Number(pageParam);

  // 페이지 번호 변경 시 URL의 쿼리 파라미터를 업데이트
  function handlePageChange(e) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  }

  return (
    <div className="body">
      <button className="btn btn-dark" onClick={setAddModalOpen}>
        새로운 여행 작성하기
      </button>

      {planList.map((plan) => (
        <div key={plan.id}>
          <Card.Root flexDirection="row" overflow="hidden" maxW="xl" my={5}>
            <Box>
              <Card.Body>
                <Card.Title mb="5">{plan.title}</Card.Title>
                <Card.Description>{plan.description}</Card.Description>
                <HStack mt="5">
                  <Badge>{plan.destination}</Badge>
                  <Badge>{plan.due}</Badge>
                </HStack>
              </Card.Body>

              <Card.Footer>
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    navigate(`/plan/view/${plan.id}`);
                  }}
                >
                  여행 보기
                </button>
              </Card.Footer>
            </Box>
          </Card.Root>
        </div>
      ))}

      {/* pagination */}
      <div className="pagination">
        <PaginationRoot
          onPageChange={handlePageChange}
          count={count}
          pageSize={10}
          page={page}
          variant="solid"
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </div>

      {/* 새 여행 modal */}
      {addModalOpen && (
        <div className={"modal"}>
          <div className={"modal-content"}>
            <div className={"modal-header"}>
              <a href="#" className={"close"} onClick={closeModal}>
                &times;
              </a>
            </div>

            <div className={"modal-body"}>
              <p>새로운 여행을 작성하시겠습니까?</p>
            </div>

            <div className={"modal-footer btn-wrap"}>
              <button className={"btn btn-dark-outline"} onClick={closeModal}>
                닫기
              </button>

              <button
                className={"btn btn-dark"}
                onClick={() => navigate(`/plan/add`)}
              >
                작성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanList;
