const express = require('express');
const app = express();
const sqlite = require('sqlite3');

app.listen(3000, () => {
    console.log("server rodando na porta 3000")
});

app.use(express.json());

//MOSTRAR TODOS OS USUARIOS
app.get('/usuarios', (req, res) => {
    db.all('select * from Usuarios', (err, row) => {
        if(err != null){
            console.log("tabela vazia.")
        }
        
        res.send(row)
    })
})

//INSERIR USUARIOS 
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;

    db.run(`insert into Usuarios (nome, email) values ('${nome}','${email}')`, (result, err) => {
        if(err == null){
            console.log("Usuario inserido com sucesso.")
        }else{
            console.log("Erro ao inserir usuario.")
        }
        res.send(req.body)
    })
})

//DELETAR USUARIOS
app.delete('/usuarios/:id', (req, res) => {
    const { usuario_id} = req.body;

    db.run(`delete from Usuarios where id = ${usuario_id}`, (result, err) => {
        if(err == null){
            console.log("Usuario deletado!")
        }else{
            console.log("Erro ao deletar usuario.")
        }
        res.send("Usuario ID deletado: "+req.body.usuario_id)
    })
});

const db = new sqlite.Database('Teste.db');

db.run('create table if not exists Usuarios(id integer primary key autoincrement, nome string, email string)')

db.run('create table if not exists Publicacoes(id integer primary key autoincrement, titulo string, conteudo string, usuario_id integer, foreign key(usuario_id) references Usuarios(id))')

//inserir publicacoes
app.post('/publicacoes', (req, res) => {
    const {titulo, conteudo, usuario_id} = req.body

    db.run(`insert into Publicacoes(titulo, conteudo, usuario_id) values ('${titulo}', '${conteudo}','${usuario_id}')`, (result, err) => {
        if(err == null){
            console.log("Publicacao inserida!")
        }else{
            console.log("Erro ao inserir publicacao.")
        }
        res.send(req.body)
    })
})

//mostrar todas publicacoes
app.get('/publicacoes', (req, res) => {
    db.all('select Publicacoes.*, Usuarios.nome as nome_usuario from Publicacoes join Usuarios on Publicacoes.usuario_id = Usuarios.id', (err, rows) => {
        if (err) {
            console.log("Erro ao buscar publicacoes:", err.message);
            res.status(500).send("Erro ao buscar publicacoes.");
            return;
        }
        res.send(rows);
    });
});

//DELETAR PUBLICACAO
app.delete('/publicacoes/:id', (req, res) => {
    const {id} = req.body;

    db.run(`delete from Publicacoes where id = ${id}`, (result, err) => {
        if(err == null){
            console.log("Publicacao deletada!")
        }else{
            console.log("Erro ao deletar publicacao.")
        }
        res.send("Publicacao ID deletado: "+req.body.id)
    })
});