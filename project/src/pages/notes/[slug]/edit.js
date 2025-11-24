'use client';

import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useRouter } from 'next/router';
import AuthGate from '@/components/AuthGate';
import db from '@/lib/db';
import dbModel from '@/lib/dbModel';
import NotesLayout from '@/components/NotesLayout';

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

export default function Edit({ note }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const uploadNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목/내용 둘 다 입력하셈");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/notes/${note._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("수정이 완료되었습니다.");
        router.push(`/notes/${note.slug}`); 
      } 
      
      else {
        alert(`게시물 수정 실패: ${result.error || '알 수 없는 오류'}`);
      }

    } 
    
    catch (error) {
      console.error("게시물 수정 중 오류 발생:", error);
      alert("네트워크 오류 또는 서버 오류가 발생했습니다.");
    } 
    
    finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="flex flex-col mx-auto gap-10 w-4/5 my-10">
      <div className="mx-auto text-3xl font-[600]">Upload Notes</div>
      <input 
        type="text" 
        value={title}
        onChange={(e) => {setTitle(e.target.value)}}
        className="text-gray-700 text-xl font-[600] bg-white/0 hover:border-blue-400 focus:border-blue-400 border-b-[1px] border-gray-300 p-1.5 outline-none transtion-all duration-200"
        placeholder="제목을 입력하세요."
        disabled={isSubmitting}
      />

      <MDEditor tabSize={2} value={content} onChange={setContent} height={500} />

      <div className="flex self-end">
        <AuthGate onAction={uploadNote}>
          <button 
            disabled={isSubmitting}
            className="px-4 py-1.5 rounded-sm bg-blue-500 text-white"
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </button>
        </AuthGate>
      </div>
    </div>
  )
}

Edit.getLayout = function getLayout(page) {
  return (
    <NotesLayout>
      {page}
    </NotesLayout>
  );
};