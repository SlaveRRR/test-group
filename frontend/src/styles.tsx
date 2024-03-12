import { Avatar as antdAvatar, Table as antdTable } from "antd";
import styled from "styled-components";

export const Avatar = styled(antdAvatar)`
  & {
    width: 100px;
    height: 100px;
  }
`;

export const Table = styled(antdTable)`
   &.ant-table-wrapper .ant-table-thead >tr>th{
    text-align: center;
  }
  &.ant-table-wrapper .ant-table-tbody >tr >td{
    text-align: center;
  }
`;
