import React from "react";

import { List, Skeleton, Flex, Spin } from "antd";

const listData = Array.from({ length: 3 }).map((_, i) => ({
  href: "https://ant.design",
  title: `ant design part ${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
}));

const LoadingList: React.FC = () => {
  return (
    <>
      <Flex gap="middle" vertical>
        <Spin tip="Loading...">
          <List
            itemLayout="vertical"
            size="large"
            dataSource={listData}
            renderItem={(item) => (
              <List.Item key={item.title}>
                <Skeleton loading={true} active>
                  <List.Item.Meta />
                </Skeleton>
              </List.Item>
            )}
          />
        </Spin>
      </Flex>
    </>
  );
};

export default LoadingList;
