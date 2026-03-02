# ReClico - Sistema de Coleta Seletiva ♻️

## 📋 Sobre o Projeto
O **ReClico** é um banco de dados relacional construído em **SQLite3** projetado para gerenciar um sistema de reciclagem e coleta de materiais. Ele conecta usuários comuns que desejam descartar materiais recicláveis aos centros de coleta especializados.

## 🗄️ Estrutura do Banco de Dados (Tabelas)
O banco é composto por quatro tabelas principais, desenhadas para garantir a integridade dos dados através de chaves estrangeiras (Foreign Keys) e restrições (Constraints):

* **usuarios**: Armazena os dados de acesso. A coluna tipo possui uma restrição (CHECK) que permite apenas os valores 'USUARIO' ou 'CENTRO'.
* **centros**: Registra os locais de coleta. Possui uma relação direta com a tabela de usuários e uma regra de exclusão em cascata (ON DELETE CASCADE), garantindo que se o usuário dono do centro for deletado, o centro também será.
* **tipos_material**: Catálogo unificado de materiais aceitos (ex: Plástico, Vidro, Metal, Papel, Eletrônicos). A coluna nome é única (UNIQUE) para evitar duplicidade.
* **solicitacoes_coleta**: O coração do sistema. Registra os pedidos feitos pelos usuários aos centros. Possui chaves estrangeiras ligando o usuário, o centro e o material. O status da coleta é restrito a 'PENDENTE', 'ACEITA' ou 'REJEITADA'.

---

## 💻 Tutorial: Como executar e verificar o banco de dados

Para inspecionar o banco de dados, você precisará ter o **SQLite3** instalado na sua máquina (vem nativo no macOS/Linux e pode ser baixado facilmente no Windows).

Abra o seu terminal (ou prompt de comando) na mesma pasta onde o arquivo ReClico.db está salvo e siga os passos abaixo:

### Passo 1: Acessar o Banco de Dados
No terminal, digite o seguinte comando para abrir o arquivo:
bash
sqlite3 ReClico.db

Seu terminal agora mostrará o prompt do SQLite (algo como sqlite> ).

### Passo 2: Melhorar a visualização dos dados (Opcional)
Antes de fazer consultas, ative o modo de colunas e os cabeçalhos para que os resultados fiquem fáceis de ler:

sql
.mode column
.headers on


### Passo 3: Verificar se as tabelas foram criadas
Para listar todas as tabelas existentes no banco, use o comando:

sql
.tables

Você deverá ver: centros, solicitacoes_coleta, sqlite_sequence, tipos_material e usuarios.

### Passo 4: Checar a estrutura e as "Constraints" (Regras)
Para ver exatamente o código SQL que gerou uma tabela e confirmar se as regras (como PRIMARY KEY, FOREIGN KEY e CHECK) estão corretas, use o comando .schema seguido do nome da tabela.
Exemplo para verificar as regras das solicitações:

sql
.schema solicitacoes_coleta

Observe na saída se os relacionamentos REFERENCES e a restrição CHECK (status IN ('PENDENTE', 'ACEITA', 'REJEITADA')) estão presentes.

### Passo 5: Consultar os dados (Ver o banco num geral)
Vamos verificar se os materiais base já estão cadastrados. Digite a seguinte query SQL:

sql
SELECT * FROM tipos_material;

Para ver se há alguma solicitação de coleta já registrada no sistema:

sql
SELECT * FROM solicitacoes_coleta;


Passo 6: Sair do SQLite
Quando terminar sua análise, basta digitar:

sql
.quit
