import { ipcMain } from "electron";
import { contextBridge, ipcRenderer } from "electron";

export interface StudentInfo {
  stuId: string;
  name: string;
  major?: string;
}

export interface Subject {
  subId: string;
  name: string;
  profName?: string;
}

export interface Selection {
  stuId: string;
  subId: string;
  score?: number;
}

const stuList: StudentInfo[] = [];
let subList: Subject[] = [];
let slcList: Selection[] = [];

interface IError {
  title: string;
  description: string;
  isError: boolean;
}

const stuDataFunc = {
  addStudent,
  removeStudent,
  removeAllStudents,
  addSubject,
  removeSubject,
  removeAllSubjects,
  addSelection,
  removeSelection,
  removeAllSelections,
  getStudents,
  getStudentById,
  getSubjects,
  getSubjectById,
  getSelections,
  getStudentSelections,
  getSubjectSelections,
};

type StuDataAllowedFunc = keyof typeof stuDataFunc;

// Function to add a student to the list
function addStudent(student: StudentInfo): IError | void {
  if (stuList.some((s) => s.stuId === student.stuId)) {
    return {
      isError: true,
      title: "学生添加失败",
      description: "学生编号重复。",
    };
  }
  stuList.push(student);
}

// Function to remove a student from the list
function removeStudent(studentId: string): IError | void {
  const index = stuList.findIndex((s) => s.stuId === studentId);
  if (index === -1) {
    return {
      isError: true,
      title: "无法删除学生",
      description: "没有找到对应学号的学生。",
    };
  }
  stuList.splice(index, 1);

  // Remove related selections
  slcList = slcList.filter((s) => s.stuId !== studentId);
}

// Function to remove all students from the list
function removeAllStudents(): IError | void {
  stuList.length = 0;
}

// Function to add a subject to the list
function addSubject(subject: Subject): IError | void {
  if (subList.some((s) => s.subId === subject.subId)) {
    return {
      isError: true,
      title: "重复科目",
      description: "已有相同科目的课程。",
    };
  }
  subList.push(subject);
}

// Function to remove a subject from the list
function removeSubject(subjectId: string): IError | void {
  const index = subList.findIndex((s) => s.subId === subjectId);
  if (index === -1) {
    return {
      isError: true,
      title: "科目不存在",
      description: `找不到课程代码为${subjectId}的科目。`,
    };
  }
  subList.splice(index, 1);
}

function removeAllSubjects() {
  subList = [];
}

// Function to add a selection to the list
function addSelection(selection: Selection): IError | void {
  if (
    slcList.some(
      (s) => s.stuId === selection.stuId && s.subId === selection.subId,
    )
  ) {
    return {
      isError: true,
      title: "重复选择",
      description: "学生已选过该课程。",
    };
  }
  slcList.push(selection);
}

// Function to remove a selection from the list
function removeSelection(studentId: string, subjectId: string): IError | void {
  const index = slcList.findIndex(
    (s) => s.stuId === studentId && s.subId === subjectId,
  );
  if (index === -1) {
    return {
      isError: true,
      title: "选择不存在",
      description: `找不到学号为${studentId}选择课程代码为${subjectId}的记录。`,
    };
  }
  slcList.splice(index, 1);
}

// Function to remove all selections from the list
function removeAllSelections(): void {
  slcList.length = 0;
}

// Get all students
function getStudents(): StudentInfo[] {
  return [...stuList];
}

// Get a specific student by ID
function getStudentById(studentId: string): StudentInfo | undefined {
  return stuList.find((s) => s.stuId === studentId);
}

// Get all subjects
function getSubjects(): Subject[] {
  return [...subList];
}

// Get a specific subject by ID
function getSubjectById(subjectId: string): Subject | undefined {
  return subList.find((s) => s.subId === subjectId);
}

// Get all selections
function getSelections(): Selection[] {
  return [...slcList];
}

// Get selections for a specific student
function getStudentSelections(studentId: string): Selection[] {
  return slcList.filter((s) => s.stuId === studentId);
}

// Get selections for a specific subject
function getSubjectSelections(subjectId: string): Selection[] {
  return slcList.filter((s) => s.subId === subjectId);
}

// Updated handler to ensure error consistency
export function registerStuDataInvokeHandler() {
  ipcMain.handle(
    "stuData:invoke",
    (event, method: StuDataAllowedFunc, args: any[]) => {
      if (typeof stuDataFunc[method] === "function") {
        console.log(`MainProcess: Try call infomanager function: ${method}`);
        const result = (stuDataFunc[method] as any)(...args);
        if (result && result.isError) {
          // Pass IError back to renderer process
          return result;
        }
        return result;
      } else {
        return {
          isError: true,
          title: "方法不存在",
          description: `调用的方法 ${method} 不存在。`,
        };
      }
    },
  );
}

export const stuDataApi = {
  invoke: (method: StuDataAllowedFunc, ...args: unknown[]) =>
    ipcRenderer.invoke("stuData:invoke", method, args),
  addStudent: (student: { stuId: string; name: string; major?: string }) =>
    ipcRenderer.invoke("stuData:invoke", "addStudent", [student]),
  removeStudent: (studentId: string) =>
    ipcRenderer.invoke("stuData:invoke", "removeStudent", [studentId]),
  removeAllStudents: () =>
    ipcRenderer.invoke("stuData:invoke", "removeAllStudents", []),
  addSubject: (subject: { subId: string; name: string; profName?: string }) =>
    ipcRenderer.invoke("stuData:invoke", "addSubject", [subject]),
  removeSubject: (subjectId: string) =>
    ipcRenderer.invoke("stuData:invoke", "removeSubject", [subjectId]),
  removeAllSubjects: () =>
    ipcRenderer.invoke("stuData:invoke", "removeAllSubjects", []),
  addSelection: (selection: { stuId: string; subId: string; score?: number }) =>
    ipcRenderer.invoke("stuData:invoke", "addSelection", [selection]),
  removeSelection: (studentId: string, subjectId: string) =>
    ipcRenderer.invoke("stuData:invoke", "removeSelection", [
      studentId,
      subjectId,
    ]),
  removeAllSelections: () =>
    ipcRenderer.invoke("stuData:invoke", "removeAllSelections", []),
  getStudents: () =>
    ipcRenderer.invoke("stuData:invoke", "getStudents", []) as Promise<
      { stuId: string; name: string; major?: string }[]
    >,
  getStudentById: (studentId: string) =>
    ipcRenderer.invoke("stuData:invoke", "getStudentById", [
      studentId,
    ]) as Promise<{ stuId: string; name: string; major?: string } | undefined>,
  getSubjects: () =>
    ipcRenderer.invoke("stuData:invoke", "getSubjects", []) as Promise<
      { subId: string; name: string; profName?: string }[]
    >,
  getSubjectById: (subjectId: string) =>
    ipcRenderer.invoke("stuData:invoke", "getSubjectById", [
      subjectId,
    ]) as Promise<
      { subId: string; name: string; profName?: string } | undefined
    >,
  getSelections: () =>
    ipcRenderer.invoke("stuData:invoke", "getSelections", []) as Promise<
      { stuId: string; subId: string; score?: number }[]
    >,
  getStudentSelections: (studentId: string) =>
    ipcRenderer.invoke("stuData:invoke", "getStudentSelections", [
      studentId,
    ]) as Promise<{ stuId: string; subId: string; score?: number }[]>,
  getSubjectSelections: (subjectId: string) =>
    ipcRenderer.invoke("stuData:invoke", "getSubjectSelections", [
      subjectId,
    ]) as Promise<{ stuId: string; subId: string; score?: number }[]>,
};
