import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// Components
import { FlexDiv } from "@/components/container";
import { Input, Button, Table } from "antd";
import { OperationBlock } from "@/cus_components/op_block";

// Tools
import { classNames } from "@/tools/css_tools";

// Preload type
import { ElectronApiType } from "@/preload";

const electronApi: ElectronApiType = (window as any).electron;
const selectionDataApi = electronApi.stuData;
const dialogApi = electronApi.dialog;

export function SelectionPage() {
  const [curStuId, setCurStuId] = useState<string | undefined>(undefined);
  const [curSubId, setCurSubId] = useState<string | undefined>(undefined);
  const [curScore, setCurScore] = useState<number | undefined>(undefined);

  const [selectionData, setSelectionData] = useState<any>(undefined);
  const [studentMap, setStudentMap] = useState<Map<string, string>>(new Map());
  const [subjectMap, setSubjectMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    refreshSelectionsInfo();
    fetchStudentAndSubjectMaps();
  }, []);

  async function fetchStudentAndSubjectMaps() {
    try {
      const students = await selectionDataApi.getStudents();
      const subjects = await selectionDataApi.getSubjects();

      const stuMap = new Map(students.map((s) => [s.stuId, s.name]));
      const subMap = new Map(subjects.map((s) => [s.subId, s.name]));

      setStudentMap(stuMap);
      setSubjectMap(subMap);
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: "初始化失败",
        description: "无法获取学生或科目信息。",
      });
    }
  }

  async function refreshSelectionsInfo() {
    const selectionInfo = await allSelections();
    setSelectionData(selectionInfo);
  }

  async function addOrUpdateSelection() {
    if (!curStuId || !curSubId) {
      dialogApi.showMessage({
        type: "error",
        title: "无效输入",
        description: "学生编号或科目编号不能为空。",
      });
      return;
    }

    if (!studentMap.has(curStuId)) {
      dialogApi.showMessage({
        type: "error",
        title: "无效学生编号",
        description: "学生编号不存在。",
      });
      return;
    }

    if (!subjectMap.has(curSubId)) {
      dialogApi.showMessage({
        type: "error",
        title: "无效科目编号",
        description: "科目编号不存在。",
      });
      return;
    }

    try {
      const existingSelections =
        await selectionDataApi.getStudentSelections(curStuId);
      const existingSelection = existingSelections.find(
        (s) => s.subId === curSubId,
      );

      if (existingSelection) {
        await selectionDataApi.removeSelection(curStuId, curSubId);
        await selectionDataApi.addSelection({
          stuId: curStuId,
          subId: curSubId,
          score: curScore,
        });
        dialogApi.showMessage({
          type: "success",
          description: "成功更新选课信息",
        });
      } else {
        await selectionDataApi.addSelection({
          stuId: curStuId,
          subId: curSubId,
          score: curScore,
        });
        dialogApi.showMessage({
          type: "success",
          description: "成功添加选课信息",
        });
      }
      refreshSelectionsInfo();
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: e.title ?? "操作失败",
        description: e.description ?? "添加或更新选课信息失败",
      });
    }
  }

  async function removeSelection() {
    if (!curStuId || !curSubId) {
      dialogApi.showMessage({
        type: "error",
        title: "无效输入",
        description: "学生编号或科目编号不能为空。",
      });
      return;
    }

    try {
      const err = await selectionDataApi.removeSelection(curStuId, curSubId);
      if (err) {
        console.log(JSON.stringify(err));
        throw err;
      }
      refreshSelectionsInfo();
      dialogApi.showMessage({
        type: "success",
        description: "成功删除选课信息",
      });
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: e.title ?? "操作失败",
        description: e.description ?? "删除选课信息失败",
      });
    }
  }

  async function allSelections() {
    try {
      const selections = await selectionDataApi.getSelections();
      if (!selections) {
        const err = {
          isError: true,
          title: "获取失败",
          description: "无法获取选课信息。",
        };
        console.log(JSON.stringify(err));
        throw err;
      }
      return selections.map((s) => ({
        ...s,
        stuName: studentMap.get(s.stuId),
        subName: subjectMap.get(s.subId),
      }));
    } catch (e) {
      dialogApi.showMessage({
        type: "error",
        title: e.title ?? "操作失败",
        description: e.description ?? "无法获取选课信息",
      });
      return []; // Return an empty array to handle the failure gracefully
    }
  }

  return (
    <FlexDiv
      expand
      className={classNames(classNames("flex-col gap-y-2 overflow-y-auto"))}
    >
      <OperationBlock name="选课信息管理">
        <Input
          placeholder="学生编号"
          onChange={function (e) {
            setCurStuId(e.target.value);
          }}
        ></Input>
        <Input
          placeholder="科目编号"
          onChange={function (e) {
            setCurSubId(e.target.value);
          }}
        ></Input>
        <Input
          placeholder="分数（可选）"
          type="number"
          onChange={function (e) {
            setCurScore(parseFloat(e.target.value));
          }}
        ></Input>
        <FlexDiv className={classNames("flex-row gap-x-2")}>
          <Button type="primary" onClick={addOrUpdateSelection}>
            添加或更新选课
          </Button>
          <Button danger onClick={removeSelection}>
            根据学生和科目删除选课
          </Button>
        </FlexDiv>
      </OperationBlock>

      <FlexDiv
        className={classNames("h-[50rem] w-full flex-auto flex-col p-2")}
      >
        <Table
          loading={selectionData == undefined}
          pagination={false}
          sticky={true}
          className={classNames("h-full w-full overflow-y-auto")}
          dataSource={selectionData}
          columns={[
            {
              title: "学生编号",
              dataIndex: "stuId",
              key: "stuId",
            },
            {
              title: "学生姓名",
              dataIndex: "stuName",
              key: "stuName",
            },
            {
              title: "科目编号",
              dataIndex: "subId",
              key: "subId",
            },
            {
              title: "科目名称",
              dataIndex: "subName",
              key: "subName",
            },
            {
              title: "分数",
              dataIndex: "score",
              key: "score",
              render: (value) => (value !== undefined ? value : "未评分"),
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
    <SelectionPage />
  </div>,
);
