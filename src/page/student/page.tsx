import { useEffect, useState } from "react";

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
    allStudent().then((data) => {
      setStuData(data);
    });
  }, []);

  async function addStudent() {
    try {
      await stuDataApi.addStudent({ stuId: curStuId, name: curName });
      dialogApi.showMessage({
        type: "success",
        description: "成功添加学生信息",
      });
    } catch (e) {
      dialogApi.showMessage({
        type: "success",
        description: "成功添加学生信息",
      });
    }
  }

  async function removeStudent() {
    try {
      await stuDataApi.removeStudent(curStuId);
      dialogApi.showMessage({
        type: "success",
        description: "成功删除学生信息",
      });
    } catch (e) {
      dialogApi.showMessage({ type: "error", description: "删除学生信息失败" });
    }
  }

  async function allStudent() {
    try {
      return await stuDataApi.getStudents();
    } catch (e) {
      dialogApi.showMessage({ type: "error", description: "无法获取学生信息" });
    }
  }

  return (
    <FlexDiv
      expand
      className={classNames(classNames("flex-col gap-y-2 overflow-y-auto"))}
    >
      <OperationBlock name="Student Management">
        <Input
          placeholder="Student ID"
          onChange={function (e) {
            setCurStuId(e.target.value);
          }}
        ></Input>
        <Input
          placeholder="Student Name"
          onChange={function (e) {
            setCurName(e.target.value);
          }}
        ></Input>
        <FlexDiv className={classNames("flex-row gap-x-2")}>
          <Button type="primary" onClick={addStudent}>
            Add Student
          </Button>
          <Button danger onClick={removeStudent}>
            Remove Student By ID
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
              title: "Student ID",
              dataIndex: "stuId",
              key: "stuId",
            },
            {
              title: "Name",
              dataIndex: "name",
              key: "name",
            },
          ]}
        ></Table>
      </FlexDiv>
    </FlexDiv>
  );
}
