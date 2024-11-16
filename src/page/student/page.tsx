import { useEffect, useState } from "react";

// Components
import { Center, FlexDiv, Container } from "@/component/container";
import { Title } from "@/component/title";
import { Segmented, Tabs, Input, Button, Table } from "antd";
import type { TabsProps } from "antd";
import { Form } from "antd";
import { OperationBlock } from "@/cus_components/op_block";

// Tools
import { classNames } from "@/tools/css_tools";

// Api
import { StuDataApiType } from "@/main/info_manager";

const stuDataApi: StuDataApiType = (window as any).electron.stuData;

export function StudentPage() {
  const [curStuId, setCurStuId] = useState<string | undefined>(undefined);
  const [curName, setCurName] = useState<string | undefined>(undefined);

  const [stuData, setStuData] = useState<any>(undefined);

  useEffect(function () {
    allStudent().then((data) => {
      setStuData(data);
    });
  }, []);

  async function addStudent(
    ...params: Parameters<typeof stuDataApi.addStudent>
  ) {
    try {
      await stuDataApi.addStudent(...params);
      toast.success("Student Added");
    } catch (e) {
      toast.error(JSON.stringify(e));
    }
  }

  async function removeStudent() {
    try {
      toast("Removing Student...");
      await axiosIns.post(
        "/student/remove",
        {},
        {
          params: {
            stuId: curStuId,
          },
        },
      );
      toast.success("Student Removed");
    } catch (e) {
      toast.error(JSON.stringify(e));
    }
  }

  async function allStudent() {
    try {
      let res = await axiosIns.get("/student/all", {});
      return res.data;
    } catch (e) {
      toast.error(JSON.stringify(e));
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
