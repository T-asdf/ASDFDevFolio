import AuthGate from "@/components/AuthGate";
import db from "@/lib/db";
import dbModel from "@/lib/dbModel";
import { useRouter } from "next/router";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function getServerSideProps(context) {
  const { slug } = context.params;

  await db();

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  try {
    const note = await dbModel.findOne({ slug: slug }).lean();

    if (!note) {
      return { notFound: true };
    }

    const noteData = {
      ...note,
      _id: note._id.toString(),
      createdAt: new Date(note.createdAt.toISOString()).toLocaleString('ko-KR', options),
    };

    return { props: { note: noteData } };

  } catch (error) {
    console.error("상세 페이지 데이터 로드 에러:", error);
    return { notFound: true };
  }
}

export default function notesContent({ note }) {
  const router = useRouter();

  async function deleteNote() {
    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("삭제가 완료되었습니다.");
        router.push('/notes'); 
      } 
      
      else {
        alert(`삭제 실패: ${result.error || '알 수 없는 오류'}`);
      }

    } 
    
    catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("네트워크 오류 또는 서버 오류가 발생했습니다.");
    } 
  };

  return (
    <div className="flex flex-col mx-auto gap-10 w-[1000px] p-8 my-10">
      <div className="flex flex-col gap-2">
        <div className="text-4xl font-[700]">{note.title}</div>
        <div className="flex gap-2">
          <div className="font-[500] ">카테고리명</div>
          <div className="font-[800]">·</div>
          <div className="text-gray-500">{note.createdAt}</div>
          
            <div className="hidden ml-auto text-xs text-gray-400">
              <AuthGate onAction={deleteNote}>삭제</AuthGate>
            </div>
        </div>
      </div>
      <div className="prose max-w-none">
        <ReactMarkdown 
          children={note.content}
          remarkPlugins={[remarkGfm]}
        />
      </div>
    </div>
  )
}