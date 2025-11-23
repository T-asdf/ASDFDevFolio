'use client';

import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useRouter } from 'next/router';

export default function Create() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const uploadNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목/내용 둘 다 입력하셈");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("업로드가 완료되었습니다.");
        router.push('/notes'); 
      } 
      
      else {
        alert(`게시물 생성 실패: ${result.error || '알 수 없는 오류'}`);
      }

    } 
    
    catch (error) {
      console.error("게시물 업로드 중 오류 발생:", error);
      alert("네트워크 오류 또는 서버 오류가 발생했습니다.");
    } 
    
    finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="flex flex-col mx-auto gap-10 w-4/5 mt-10">
      <div className="mx-auto text-3xl font-[600]">Upload Notes</div>
      <input 
        type="text" 
        value={title}
        onChange={(e) => {setTitle(e.target.value)}}
        className="text-xl font-[500] border-b-[1px] border-gray-300 p-1.5 outline-none"
        placeholder="제목을 입력하세요."
        disabled={isSubmitting}
      />

      <MDEditor tabSize={2} value={content} onChange={setContent} height={500} />

      <div className="flex self-end">
        <button 
          onClick={uploadNote} 
          disabled={isSubmitting}
          className="px-4 py-1.5 rounded-sm bg-blue-500 text-white"
        >
          {isSubmitting ? '업로드 중...' : 'Upload'}
        </button>
      </div>
    </div>
  )
}