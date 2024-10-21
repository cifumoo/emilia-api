import Bard from '../../../lib/gemini';

export default async function handler(req, res) {
  try {
    const { ask } = req.query;
    if (!ask) {
      return res.status(400).json({
        content: "Bad Request: No Query Ask Provided",
        status: 400,
        creator: "cifumo",
      });
    }

    const bard = new Bard();
    await bard.configure('g.a000owiajsjoIu7m7RqNUxgXfad_6yic-R8teXZEL8KLCoC5Xg-BEz-lrTU_iTgDN6bQ-NV-yQACgYKASYSARISFQHGX2Mi1Zs8kiL76hzW9eZlXQbxfBoVAUF8yKro5_bU5VONuEnPfB_NnHSV0076');

    const { status, content } = await bard.question(ask);
    if (!status) {
      res.status(500).json({
        content: content,
        status: 500,
        creator: "cifumo",
      });
    } else {
      res.status(200).json({
        content: content,
        status: 200,
        creator: "cifumo",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      content: "Internal Server Error!",
      status: 500,
      creator: "cifumo",
    });
  }
}
