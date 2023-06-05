const handler= async (req, res) => {
  const startDate = req.query.startDate || '2020-01-01';
  const slug = req.query.slug;

  try {
    res.status(200).json({
      pageViews: 0,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default handler;