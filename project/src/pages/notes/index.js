import NotesLayout from "@/components/NotesLayout";
import db from "@/lib/db";
import dbModel from "@/lib/dbModel";
import Link from "next/link";

const extractFirstImageUrl = (markdownText) => {
  const imageRegex = /!\[.*?\]\((.*?)\)/; 
  const match = markdownText.match(imageRegex);

  if (match && match[1]) {
    return match[1]; 
  }
  
  return null;
};

export async function getServerSideProps() {
  await db();

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
    // hour12: false,
  };

  const stripMarkdown = (markdownText) => {
    let plainText = markdownText.replace(/([#*-])+\s?/g, '');

    plainText = plainText.replace(/```[\s\S]*?```/g, ''); 
    plainText = plainText.replace(/^>\s?/gm, ''); 
    plainText = plainText.replace(/^[-\*_]{3,}\s*$/gm, '');
    plainText = plainText.replace(/^#+\s?/gm, '');
    plainText = plainText.replace(/(\*\*|__|\*|~~)/g, '');
    plainText = plainText.replace(/!\[(.*?)\]\(.*?\)/g, '');
    plainText = plainText.replace(/\[(.*?)\]\(.*?\)/g, '$1');
    plainText = plainText.replace(/<[^>]*>/g, '');
    plainText = plainText.replace(/^[*-]\s?/gm, '');
    plainText = plainText.replace(/(\r\n|\n|\r)/g, ' ');
    plainText = plainText.replace(/\s{2,}/g, ' '); 
    plainText = plainText.trim();
    
    return plainText;
  };

  try {
    const notes = await dbModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    const notesData = notes.map(note => {
      const imageUrl = extractFirstImageUrl(note.content);

      return {
        ...note,  
        _id: note._id.toString(),
        createdAt: new Date(note.createdAt.toISOString()).toLocaleString('ko-KR', options),
        plainContent: stripMarkdown(note.content),
        imageUrl: imageUrl,
      }
    });

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
    <div className="flex p-7 md:px-10 lg:px-14 justify-center">
      {notes.length === 0 ? (
        <div className="">게시물이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-[1300px]">
          {notes.map((note) => (
            <Link key={note._id} href={`/notes/${note.slug}`}  >
              <div className="bg-white cursor-pointer relative w-full flex flex-col shadow-lg h-[350px]">
                
                {/* 이미지가 있을 경우 썸네일로, 없을 경우 제목 앞 글자로 */}
                {note.imageUrl ? (
                  <div className="min-h-[150px] bg-gray-200">
                    <img 
                      src={note.imageUrl} 
                      alt={note.title} 
                      className="w-full h-[150px] object-cover" 
                    />
                  </div>
                ) : (
                  <div className="flex justify-center text-6xl items-center font-[800] text-gray-700 bg-gray-200 min-h-[150px]">
                    {note.title[0]}
                  </div>
                )}
                
                <div className="flex flex-col gap-2 p-5 tracking-tight">
                  <div className="text-lg font-[600] overflow-hidden line-clamp-1">{note.title}</div>
                  <div className="text-sm text-gray-500 font-[400] overflow-hidden line-clamp-4">{note.plainContent}</div>
                </div>

                <div className="absolute bottom-4 right-5 text-gray-400 text-xs">더보기</div>
                <div className="flex gap-1.5 absolute bottom-4 left-5 text-gray-400 text-xs">
                  <div>{note.createdAt}</div>
                  <div className="font-[800]">·</div>
                  <div>{note.category || "카테고리 없음"}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

Notes.getLayout = function getLayout(page) {
  return (
    <NotesLayout>
      {page}
    </NotesLayout>
  );
};