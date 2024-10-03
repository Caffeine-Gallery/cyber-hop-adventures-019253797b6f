export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addHighScore' : IDL.Func([IDL.Text, IDL.Int], [], []),
    'getHighScores' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Int))],
        ['query'],
      ),
    'getProgress' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Int)], ['query']),
    'saveProgress' : IDL.Func([IDL.Text, IDL.Int], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
