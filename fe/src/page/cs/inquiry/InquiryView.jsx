import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../components/root/Breadcrumb.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";

function InquiryView(props) {
  const { id } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/cs/inquiry/view/${id}`).then((res) => {
      setInquiry(res.data);
    });
  }, []);

  if (inquiry == null) {
    return <Spinner />;
  }

  return (
    <div className={"inquiry"}>
      <Breadcrumb
        depth1={"고객센터"}
        navigateToDepth1={() => navigate(`/cs`)}
        depth2={"문의하기"}
        navigateToDepth2={() => navigate(`/cs/inquiry/list`)}
        depth2={"문의글 보기"}
        navigateToDepth2={() => navigate(`/cs/inquiry/view/${id}`)}
      />

      <div className={"body-normal"}>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>{inquiry.title}</th>
            </tr>
            <tr>
              <th>{inquiry.writer}</th>
              <th>{inquiry.inserted}</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan={2}>{inquiry.content}</td>
            </tr>
            <tr>
              <td colSpan={2}>첨부파일</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InquiryView;
