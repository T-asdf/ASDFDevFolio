'use client';

import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

export default function Create() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  return (
    <div className="flex flex-col mx-auto gap-10 w-4/5 mt-10">
      <div className="mx-auto text-3xl font-[600]">Upload Notes</div>
      <input 
        type="text" 
        value={title}
        onChange={(e) => {setTitle(e.target.value)}}
        className="text-xl font-[500] border-b-[1px] border-gray-300 p-1.5 outline-none"
        placeholder="제목을 입력하세요."
      />

      <MDEditor tabSize={2} value={content} onChange={setContent} height={500} />

      <div className="flex self-end">
        <button className="px-4 py-1.5 rounded-sm bg-blue-500 text-white">Upload</button>
      </div>
    </div>
  )
}