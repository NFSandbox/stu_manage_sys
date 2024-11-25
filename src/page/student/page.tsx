import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// Components
import { Center, FlexDiv, Container } from "@/components/container";
import { Title } from "@/components/title";
import { Segmented, Tabs, Input, Button, Table } from "antd";
import type { TabsProps } from "antd";
import { Form } from "antd";
import { OperationBlock } from "@/cus_components/op_block";

// Tools
import { classNames } from "@/tools/css_tools";

// Preload type
import { ElectronApiType } from "@/preload";

const electronApi: ElectronApiType = (window as any).electron;
const stuDataApi = electronApi.stuData;
const dialogApi = electronApi.dialog;

export function StudentPage() {
  const [curStuId, setCurStuId] = useState<string | undefined>(undefined);
  const [curName, setCurName] = useState<string | undefined>(undefined);

  const [stuData, setStuData] = useState<any>(undefined);

  useEffect(function () {
    refreshStudentsInfo();
  }, []);

  async function refreshStudentsInfo() {
    const stuInfo = await allStudent();
    setStuData(stuInfo);
  }

  async function addStudent() {
    try {
      const err = await stuDataApi.addStudent({
        stuId: curStuId,
        name: curName,
      });
      if (err) {
        console.log(JSON.stringify(err));
        throw err;
      }
      refreshStudentsInfo();
      dialogApi.showMessage({
        type: "success",
        description: "成功添加学生信息",
      });
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: e.title ?? "操作失败",
        description: e.description ?? "添加学生信息失败",
      });
    }
  }
  async function removeStudent() {
    try {
      const err = await stuDataApi.removeStudent(curStuId);
      if (err) {
        console.log(JSON.stringify(err));
        throw err;
      }
      refreshStudentsInfo();
      dialogApi.showMessage({
        type: "success",
        description: "成功删除学生信息",
      });
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: e.title ?? "操作失败",
        description: e.description ?? "删除学生信息失败",
      });
    }
  }

  async function allStudent() {
    try {
      const students = await stuDataApi.getStudents();
      if (!students) {
        const err = {
          isError: true,
          title: "获取失败",
          description: "无法获取学生信息。",
        };
        console.log(JSON.stringify(err));
        throw err;
      }
      return students;
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: e.title ?? "操作失败",
        description: e.description ?? "无法获取学生信息",
      });
      return []; // Return an empty array to handle the failure gracefully
    }
  }

  return (
    <FlexDiv
      expand
      className={classNames(classNames("flex-col gap-y-2 overflow-y-auto"))}
    >
      <OperationBlock name="学生信息管理">
        <Input
          placeholder="学生编号"
          onChange={function (e) {
            setCurStuId(e.target.value);
          }}
        ></Input>
        <Input
          placeholder="学生名称"
          onChange={function (e) {
            setCurName(e.target.value);
          }}
        ></Input>
        <FlexDiv className={classNames("flex-row gap-x-2")}>
          <Button type="primary" onClick={addStudent}>
            添加学生
          </Button>
          <Button danger onClick={removeStudent}>
            根据编号删除学生
          </Button>
        </FlexDiv>
      </OperationBlock>

      <FlexDiv
        className={classNames("h-[50rem] w-full flex-auto flex-col p-2")}
      >
        <Table
          loading={stuData == undefined}
          pagination={false}
          sticky={true}
          className={classNames("h-full w-full overflow-y-auto")}
          dataSource={stuData}
          columns={[
            {
              title: "学生编号",
              dataIndex: "stuId",
              key: "stuId",
            },
            {
              title: "学生姓名",
              dataIndex: "name",
              key: "name",
            },
          ]}
        ></Table>
      </FlexDiv>
    </FlexDiv>
  );
}

const root = createRoot(document.body);
console.log("In login.tsx");
root.render(
  <div className="flex h-screen w-screen flex-none flex-col items-center justify-start">
    <StudentPage />
  </div>,
);
