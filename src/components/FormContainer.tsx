import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import FormModal from "./FormModal";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const session = await getSession();
  const role = session?.role;
  const currentUserId = session?.id;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        relatedData = {
          teachers: await prisma.teacher.findMany({ select: { id: true, name: true, surname: true } }),
        };
        break;

      case "class":
        relatedData = {
          teachers: await prisma.teacher.findMany({ select: { id: true, name: true, surname: true } }),
          grades: await prisma.grade.findMany({ select: { id: true, level: true } }),
        };
        break;

      case "teacher":
        relatedData = {
          subjects: await prisma.subject.findMany({ select: { id: true, name: true } }),
        };
        break;

      case "student":
        relatedData = {
          classes: await prisma.class.findMany({ include: { _count: { select: { students: true } } } }),
          grades: await prisma.grade.findMany({ select: { id: true, level: true } }),
        };
        break;

      case "exam":
        relatedData = {
          lessons: await prisma.lesson.findMany({
            where: role === "teacher" ? { teacherId: currentUserId! } : {},
            select: { id: true, name: true },
          }),
        };
        break;

      case "lesson":
        relatedData = {
          subjects: await prisma.subject.findMany({ select: { id: true, name: true } }),
          classes: await prisma.class.findMany({ select: { id: true, name: true } }),
          teachers: await prisma.teacher.findMany({ select: { id: true, name: true, surname: true } }),
        };
        break;

      case "assignment":
        relatedData = {
          lessons: await prisma.lesson.findMany({
            where: role === "teacher" ? { teacherId: currentUserId! } : {},
            select: { id: true, name: true },
          }),
        };
        break;

      case "result":
        relatedData = {
          students: await prisma.student.findMany({ select: { id: true, name: true, surname: true } }),
          exams: await prisma.exam.findMany({ select: { id: true, title: true } }),
          assignments: await prisma.assignment.findMany({ select: { id: true, title: true } }),
        };
        break;

      case "event":
        relatedData = {
          classes: await prisma.class.findMany({ select: { id: true, name: true } }),
        };
        break;

      case "announcement":
        relatedData = {
          classes: await prisma.class.findMany({ select: { id: true, name: true } }),
        };
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
