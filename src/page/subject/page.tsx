import { useEffect, useState } from "react";

// Components
import { FlexDiv } from "@/components/container";
import { Input, Button, Table } from "antd";
import { OperationBlock } from "@/cus_components/op_block";

// Tools
import { classNames } from "@/tools/css_tools";

// Preload type
import { ElectronApiType } from "@/preload";

const electronApi: ElectronApiType = (window as any).electron;
const subjectDataApi = electronApi.stuData;
const dialogApi = electronApi.dialog;

export function SubjectPage() {
  const [curSubId, setCurSubId] = useState<string | undefined>(undefined);
  const [curSubName, setCurSubName] = useState<string | undefined>(undefined);
  const [curProfName, setCurProfName] = useState<string | undefined>(undefined);

  const [subData, setSubData] = useState<any>(undefined);

  useEffect(function () {
    refreshSubjectsInfo();
  }, []);

  async function refreshSubjectsInfo() {
    const subInfo = await allSubjects();
    setSubData(subInfo);
  }

  async function addSubject() {
    try {
      const err = await subjectDataApi.addSubject({
        subId: curSubId,
        name: curSubName,
        profName: curProfName,
      });
      if (err) {
        console.log(JSON.stringify(err));
        throw err;
      }
      refreshSubjectsInfo();
      dialogApi.showMessage({
        type: "success",
        description: "成功添加科目信息",
      });
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: e.title ?? "操作失败",
        description: e.description ?? "添加科目信息失败",
      });
    }
  }
  async function removeSubject() {
    try {
      const err = await subjectDataApi.removeSubject(curSubId);
      if (err) {
        console.log(JSON.stringify(err));
        throw err;
      }
      refreshSubjectsInfo();
      dialogApi.showMessage({
        type: "success",
        description: "成功删除科目信息",
      });
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: e.title ?? "操作失败",
        description: e.description ?? "删除科目信息失败",
      });
    }
  }

  async function allSubjects() {
    try {
      const subjects = await subjectDataApi.getSubjects();
      if (!subjects) {
        const err = {
          isError: true,
          title: "获取失败",
          description: "无法获取科目信息。",
        };
        console.log(JSON.stringify(err));
        throw err;
      }
      return subjects;
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: e.title ?? "操作失败",
        description: e.description ?? "无法获取科目信息",
      });
      return []; // Return an empty array to handle the failure gracefully
    }
  }

  return (
    <FlexDiv
      expand
      className={classNames(classNames("flex-col gap-y-2 overflow-y-auto"))}
    >
      <OperationBlock name="科目信息管理">
        <Input
          placeholder="科目编号"
          onChange={function (e) {
            setCurSubId(e.target.value);
          }}
        ></Input>
        <Input
          placeholder="科目名称"
          onChange={function (e) {
            setCurSubName(e.target.value);
          }}
        ></Input>
        <Input
          placeholder="教授名称（可选）"
          onChange={function (e) {
            setCurProfName(e.target.value);
          }}
        ></Input>
        <FlexDiv className={classNames("flex-row gap-x-2")}>
          <Button type="primary" onClick={addSubject}>
            添加科目
          </Button>
          <Button danger onClick={removeSubject}>
            根据编号删除科目
          </Button>
        </FlexDiv>
      </OperationBlock>

      <FlexDiv
        className={classNames("h-[50rem] w-full flex-auto flex-col p-2")}
      >
        <Table
          loading={subData == undefined}
          pagination={false}
          sticky={true}
          className={classNames("h-full w-full overflow-y-auto")}
          dataSource={subData}
          columns={[
            {
              title: "科目编号",
              dataIndex: "subId",
              key: "subId",
            },
            {
              title: "科目名称",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "教授名称",
              dataIndex: "profName",
              key: "profName",
            },
          ]}
        ></Table>
      </FlexDiv>
    </FlexDiv>
  );
}
