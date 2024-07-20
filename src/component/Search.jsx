import React from "react";
// import { Link } from "react-router-dom";
import { DatePicker, Select } from "antd";
// import { DownOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { SiMicrosoftexcel } from "react-icons/si";
import { TfiReload } from "react-icons/tfi";

function SearchInput() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  return (
    <div className="flex gap-[5px] items-center">
      <DatePicker onChange={onChange} />
      <Select
        showSearch
        style={{
          width: 200,
        }}
        placeholder="Lọc"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? "").includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        options={[
          {
            value: "1",
            label: "Not Identified",
          },
          {
            value: "2",
            label: "Closed",
          },
          {
            value: "3",
            label: "Communicated",
          },
          {
            value: "4",
            label: "Identified",
          },
          {
            value: "5",
            label: "Resolved",
          },
          {
            value: "6",
            label: "Cancelled",
          },
        ]}
      />

      <Search
        placeholder="Tìm kiếm"
        onSearch={onSearch}
        style={{
          width: 300,
        }}
      />

      <SiMicrosoftexcel
        size={30}
        className="p-2 bg-white border border-black"
      />
      <TfiReload size={30} className="p-2 bg-white border border-black"
        title="Cập nhật dữ liệu"
      />
    </div>
  );
}

export default SearchInput;
