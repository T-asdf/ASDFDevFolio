import db from "@/lib/db";
import dbModel from "@/lib/dbModel";

export default async function handler(req, res) {
  // URL에서 동적 ID 값 추출
  const { query: { id }, method } = req; 

  await db();

  switch (method) {
    case 'GET': // 읽기
      try {
        const note = await dbModel.findById(id);

        if (!note) {
          return res.status(404).json({ success: false, message: '노트를 찾을 수 없습니다.' });
        }

        res.status(200).json({ success: true, data: note });
      } 
      
      catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;

    case 'PUT': // 수정
      try {
        const note = await dbModel.findByIdAndUpdate(id, req.body, {
          new: true, // 업데이트된 문서를 반환
          runValidators: true, // 업데이트 시에도 유효성 검사 실행
        });

        if (!note) {
          return res.status(404).json({ success: false, message: '노트를 찾을 수 없습니다.' });
        }

        res.status(200).json({ success: true, data: note });
      } 
      
      catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      
      break;

    case 'DELETE': // 삭제
      try {
        const deletedNote = await dbModel.deleteOne({ _id: id });
        
        if (deletedNote.deletedCount === 0) {
          return res.status(404).json({ success: false, message: '삭제할 노트를 찾을 수 없습니다.' });
        }
        // 성공적으로 삭제되었지만 반환할 내용이 없음
        res.status(200).json({ success: true, data: {} }); 
      } 
      
      catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);

      break;
  }
}