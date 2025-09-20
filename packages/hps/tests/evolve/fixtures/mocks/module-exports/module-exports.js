module.exports = {
  // with `/` prefix
  '/moduleExports': (req, res) => {
    res.json({
      code: '0000',
      message: 'module.exports = {...}',
      data: ['module.exports = { moduleExports: (req, res)=> {} }'],
    });
  },
};
