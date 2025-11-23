import db from "@/lib/db";
import dbModel from "@/lib/dbModel";

export default async function handler(req, res) {
  await db(); // MongoDB 연결

  const { method } = req;

  switch (method) {
    case 'GET': // 읽기
      try {
        const notes = await dbModel.find({})
          .sort({ createdAt: -1 }); // 최신 글 정렬
        res.status(200).json({ success: true, data: notes });
      } 
      
      catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST': // 생성
      try {
        const note = await dbModel.create(req.body);
        res.status(201).json({ success: true, data: note });
      } 
      
      catch (error) {
        res.status(400).json({ success: false, error: error.message }); 
      }

      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);

      break;
  }
}