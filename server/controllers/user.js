import { db } from "../db.js";

export const getUsers = (_, res) => {
  const q = "SELECT * FROM times";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const addTeams = (req, res) => {
  const q = "INSERT INTO times(nome, num, ciclos, partida, posicao) VALUES(?)";

  const values = [
    req.body.nome,
    req.body.num,
    req.body.ciclos,
    req.body.partida,
    req.body.posicao,
  ];

  db.query(q, [values], (err) => {
    if (err) return res.json(err);

    return res.status(200).json("Time adicionado com sucesso");
  });
};
