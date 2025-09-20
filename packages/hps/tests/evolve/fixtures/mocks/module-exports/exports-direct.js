// without `/` prefix
exports.exportsFunction = (req, res) => {
  res.json({
    code: '0000',
    message: 'exports.exportsFunction = {...}',
    data: [
      'exports.exportsFunction = { exports.exportsFunction: (req, res)=> {} }',
    ],
  });
};
