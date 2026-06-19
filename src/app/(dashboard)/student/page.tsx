import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const StudentPage = async () => {
  const session = await getSession();

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: session!.id } },
    },
  });

  const classId = classItem[0]?.id;

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">
            Schedule {classItem[0] ? `(${classItem[0].name})` : ""}
          </h1>
          {classId ? (
            <BigCalendarContainer type="classId" id={classId} />
          ) : (
            <p className="text-gray-400 text-sm mt-4">No class assigned.</p>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
