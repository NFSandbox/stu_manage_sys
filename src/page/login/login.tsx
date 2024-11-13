import { Button, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";

import { ElectronApiType } from "@/preload";

import "@/index.css";
import "@/global.css";

const electronApi: ElectronApiType = (window as any).electron;

export function LoginCard() {
  // const navigate = useNavigate();
  function handleFinish() {
    window.console.log("Login clicked");
    electronApi.window.open.main();
  }

  return (
    <div className="flex h-full w-full max-w-[30rem] flex-auto flex-col items-center justify-start">
      <h1 className="py-4 text-2xl font-bold opacity-80">登录管理系统</h1>
      <Form
        name="login"
        initialValues={{}}
        style={{ width: "100%" }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入您的用户名!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          <div className="py-2">
            或者 <a href="">注册新账号</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

const root = createRoot(document.body);
console.log("In login.tsx");
root.render(
  <div className="flex h-screen w-screen flex-none flex-col items-center justify-start">
    <LoginCard />
  </div>,
);
