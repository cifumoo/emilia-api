import { info } from '../../../lib/ml';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    res.json({ status: false, message: "no parameter ask" })
  }

  try {
    const result = await info(q);
    res.status(200).json({
      creator: "cifumo",
      status: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      creator: "cifumo",
      status: false,
      error: 'Failed to fetch data'
    });
  }
}