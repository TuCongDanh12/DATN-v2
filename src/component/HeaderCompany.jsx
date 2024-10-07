import { useState, useEffect } from "react";
import authService from "../services/auth.service";

const CompanyInfo = ({ onCompanyLoaded }) => {
  const [infoCompany, setInfoCompany] = useState(null);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await authService.getProfile();
        setInfoCompany(res.data.result.data.company);

        // Gọi hàm onCompanyLoaded nếu có truyền vào khi dữ liệu đã tải xong
        if (onCompanyLoaded) {
          onCompanyLoaded();
        }
      } catch (error) {
        console.error("Error fetching company info", error);
      }
    };
    getInfo();
  }, [onCompanyLoaded]);

  return (
    <div className="flex justify-center items-center ml-5">
      <div className="w-[100%] text-left">
        <h2>
          <strong>Tên:</strong> {infoCompany?.companyName || "Đang tải..."}
        </h2>
        <p>
          <strong>Địa chỉ:</strong>{" "}
          {infoCompany?.companyAddress || "Đang tải..."}
        </p>
        <p>
          <strong>Mã số thuế:</strong>{" "}
          {infoCompany?.companyTaxCode || "Đang tải..."}
        </p>
        <p>
          <strong>Email:</strong> {infoCompany?.companyEmail || "Đang tải..."}
        </p>
        <p>
          <strong>Số điện thoại:</strong>{" "}
          {infoCompany?.companyPhone || "Đang tải..."}
        </p>
      </div>
    </div>
  );
};

export default CompanyInfo;
