import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Dropdown, Statistic, Tag, Typography, message } from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import { AxiosResponse, IGroup } from "./types/groups";
import { Avatar,Table } from "./styles";

const {Text} = Typography

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
 
  const getData = async () => {
    try {
      const {
        data: response,
        status,
        statusText,
      } = await axios.get<AxiosResponse>("http://localhost:3000/");
      if (status !== 200) {
        throw new Error(statusText);
      }
      if (response["result"] && response?.data) {
        return response.data;
      }
      throw new Error("Некорректные данные");
    } catch (error) {
      messageApi.error(error.message);
    }
  };
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getData(),
  });

  const colorsArray = useMemo(() => {
    const arrColors: string[] = data?.map((el) => el.avatar_color);
    if (arrColors) {
      return arrColors
        .filter((el, i) => !!el && arrColors.indexOf(el) === i)
        .map((el) => ({ text: el, value: el }));
    }
  }, [isSuccess]);

  const columns: TableColumnsType<IGroup> = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      render: (value) => <Text strong>{value}</Text>
    },
    {
      title: "Количество подписчиков",
      dataIndex: "members_count",
      key: "members_coun",
      render:(value) => <Statistic value={value}/>
    },
    {
      title: "Тип группы",
      dataIndex: "closed",
      key: "closed",
      render: (text) => (
        <Tag color={`${text ? "green" : "volcano"}`}>{`${
          text ? "Открытая" : "Закрытая"
        }`}</Tag>
      ),
      filters: [
        {
          text: "Открытая",
          value: true,
        },
        {
          text: "Закрытая",
          value: false,
        },
      ],
      onFilter: (value, group) => group.closed === value,
    },
    {
      title: "Друзья",
      dataIndex: "friends",
      key: "friends",
      render: (_, { friends }) => {
        if (friends) {
          const items: MenuProps["items"] = friends.map((el, i) => ({
            label: <p>{`${el.first_name} ${el.last_name}`}</p>,
            key: i,
          }));
          return (
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button>Посмотреть друзей</Button>
            </Dropdown>
          );
        }
      },
      filters:[
        {
          text: "Есть",
          value: true,
        },
        {
          text: "Нет",
          value: false,
        },
      ],
      onFilter: (value, {friends}) => Boolean(friends?.length) === value
    },
    {
      title: "Аватарка",
      dataIndex: "avatar_color",
      key: "avatar_color",
      render: (_, { avatar_color }) =>
        avatar_color && (
          <Avatar style={{ backgroundColor: `${avatar_color}` }} />
        ),
      filters: colorsArray,
      onFilter: (value, group) => group?.avatar_color === value,
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
  ];

  return (
    <>
      {contextHolder}
      <Table columns={columns} dataSource={data} loading={isLoading} />
    </>
  );
};
export default App;
