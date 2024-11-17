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

class CustomError extends Error {
  constructor(
    public title: string,
    public description: string,
  ) {
    super(description);
    this.name = title;
    this.title = title;
    this.description = description;
  }
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
function addStudent(student: StudentInfo): void {
  if (stuList.some((s) => s.stuId === student.stuId)) {
    throw new CustomError("重复学生", "已有相同学号的学生。");
  }
  stuList.push(student);
}

// Function to remove a student from the list
function removeStudent(studentId: string): void {
  const index = stuList.findIndex((s) => s.stuId === studentId);
  if (index === -1) {
    throw new CustomError("学生不存在", `找不到学号为${studentId}的学生。`);
  }
  stuList.splice(index, 1);

  // Remove related selections
  slcList = slcList.filter((s) => s.stuId !== studentId);
}

// Function to remove all students from the list
function removeAllStudents(): void {
  stuList.length = 0;
}

// Function to add a subject to the list
function addSubject(subject: Subject): void {
  if (subList.some((s) => s.subId === subject.subId)) {
    throw new CustomError("重复科目", "已有相同科目的课程。");
  }
  subList.push(subject);
}

// Function to remove a subject from the list
function removeSubject(subjectId: string): void {
  const index = subList.findIndex((s) => s.subId === subjectId);
  if (index === -1) {
    throw new CustomError("科目不存在", `找不到课程代码为${subjectId}的科目。`);
  }
  subList.splice(index, 1);
}

// Function to remove all subjects from the list
function removeAllSubjects(): void {
  subList.length = 0;
}

// Function to add a selection to the list
function addSelection(selection: Selection): void {
  if (
    slcList.some(
      (s) => s.stuId === selection.stuId && s.subId === selection.subId,
    )
  ) {
    throw new CustomError("重复选择", "学生已选过该课程。");
  }
  slcList.push(selection);
}

// Function to remove a selection from the list
function removeSelection(studentId: string, subjectId: string): void {
  const index = slcList.findIndex(
    (s) => s.stuId === studentId && s.subId === subjectId,
  );
  if (index === -1) {
    throw new CustomError(
      "选择不存在",
      `找不到学号为${studentId}选择课程代码为${subjectId}的记录。`,
    );
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

export function registerStuDataInvokeHandler() {
  ipcMain.handle(
    "stuData:invoke",
    (event, method: StuDataAllowedFunc, args: any[]) => {
      if (typeof stuDataApi[method] === "function") {
        try {
          return (stuDataApi[method] as any)(...args);
        } catch (error) {
          throw { title: error.title || "Error", description: error.message };
        }
      } else {
        throw {
          title: "Method Not Found",
          description: `The method ${method} does not exist.`,
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
