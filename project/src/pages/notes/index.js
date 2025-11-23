import db from "@/lib/db";
import dbModel from "@/lib/dbModel";

export async function getServerSideProps() {
  await db();

  try {
    const notes = await dbModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    const notesData = notes.map(note => ({
      ...note,
      _id: note._id.toString(),
      createdAt: note.createdAt.toISOString(),
    }));

    return {
      props: {
        notes: notesData,
      },
    };
  } 
  
  catch (error) {
    console.error("에러가 있을리가", error);
    return { props: { notes: [] } };
  }
}

export default function Notes({ notes }) {
  return (
    <div className="flex p-5 justify-center">
      {notes.length === 0 ? (
        <div className="">게시물이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-[1000px]">
          {notes.map((note) => (
            <div key={note._id} className="cursor-pointer relative w-full flex gap-4 border-[1px] border-gray-300 p-5 rounded-md h-[200px]">
              <div className="flex justify-center items-center border-2 border-gray-500 my-auto rounded-md min-w-[150px] min-h-[150px]">이미지</div>
              
              <div className="flex flex-col gap-2">
                <div className="text-xl font-[600]">{note.title}</div>
                <div className="text-sm text-gray-500 font-[300] overflow-hidden line-clamp-5">{note.content}</div>
              </div>

              <div className="absolute bottom-3 right-5 text-gray-400 text-xs">더보기</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}