import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Popconfirm,
} from "antd";
import { getAllUsers, updateUserStatus } from "../../service/userService";
import { useNotification } from "../../shared/contexts/NotificationContext.jsx";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const getAllUserDetails = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      showError("Failed to fetch user details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUserDetails();
  }, []);

  const handleActiveStatusChange = async (user) => {
    try {
      setLoading(true);
      const updatedStatus = !user.isActive;
      await updateUserStatus(user._id, { isActive: updatedStatus });
      showSuccess(
        `User ${updatedStatus ? "unblocked" : "blocked"} successfully`
      );
      getAllUserDetails();
    } catch (error) {
      console.error("Failed to change user status:", error);
      showError("Failed to change user status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" ? true : user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "Active"
          ? user.isActive === true
          : user.isActive === false;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const columns = [
    { title: "ID", dataIndex: "_id", width: 80 },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    { title: "Email", dataIndex: "email" },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Blocked"}
        </Tag>
      ),
      width: 140,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Popconfirm
            title={`Are you sure to ${
              record.isActive ? "block" : "unblock"
            } this user?`}
            onConfirm={() => handleActiveStatusChange(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" 
            style={{ color: record.isActive ? "green" : "red" }}
            icon={record.isActive ? <CheckOutlined /> : <CloseOutlined />}>
              Change Status
            </Button>
          </Popconfirm>
        </div>
      ),
      width: 160,
    },
  ];

  return (
    <div>
      <Card title="All Users">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input.Search
            allowClear
            placeholder="Search name or email"
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 160 }}
            options={[
              { value: "all", label: "All roles" },
              { value: "Customer", label: "Customer" },
              { value: "ShopOwner", label: "Owner" },
              { value: "Admin", label: "Admin" },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
            options={[
              { value: "all", label: "All statuses" },
              { value: "Active", label: "Active" },
              { value: "Blocked", label: "Blocked" },
            ]}
          />
        </Space>
        <Table
          rowKey="_id"
          loading={loading}
          dataSource={filteredUsers}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
