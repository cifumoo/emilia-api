import omni from '../../../lib/omniplex';

export default async function handler(req, res) {
  const { ask, prompt } = req.query;
  if (!ask) {
    res.json({ status: false, message: "no parameter query" })	
  }
  
  try {
    const result = await omni(ask, prompt || 'Selalu gunakan bahasa indonesia ketika menjawab pertanyaan, dan gunakan format [sumber kutipan] untuk setiap kutipan. namamu adalah Emilia, tugasmu untuk membantu menjawab pertanyaan yang di berikan dengan baik dan dengan tutur kata yang sopan dan ramah.');
    res.status(200).json({ 
    creator: "cifumo",
    status: true, 
    data: result 
    });
  } catch (error) {
    res.status(500).json({ 
    creator: "cifumo", 
    status: false, 
    error: 'Failed to fetch data\nError: ' + error.message 
    });
  }
}
