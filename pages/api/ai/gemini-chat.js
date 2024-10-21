import Bard from '../../../lib/gemini';

export default async function handler(req, res) {
  const { ask } = req.query;
  if (!ask) {
    res.json({ creator: "cifumo", status: false, message: "no parameter query" })
  }

  try {
    const bard = new Bard();
    await bard.configureGemini('AIzaSyBIC7UKUwH1WGAXXUDoPDZUeRqwV78BRsQ');

    const result = await bard.questionGemini(ask);
    res.status(200).json({ creator: 'cifumo', status: true, data: result.content });
  } catch (error) {
    res.status(500).json({ creator: 'cifumo', status: false, error: 'Failed to fetch data' });
  }
}