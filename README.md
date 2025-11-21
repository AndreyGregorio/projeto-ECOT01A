# 📱 Guia de Execução do Projeto (React Native + Expo + Node + Express + PostgreSQL)

Este documento explica **passo a passo** como configurar e executar o projeto completo, incluindo backend, banco de dados e frontend mobile.

---

# 🚀 1. Configuração do Backend

## 1.1. Instale o servidor PostgreSQL

Certifique-se de que você tenha o **PostgreSQL** instalado em sua máquina.

Você pode baixar aqui:

* [https://www.postgresql.org/download/](https://www.postgresql.org/download/)

---

## 1.2. Certifique-se de que você tenha o **Node** instalado em sua máquina.
Você pode baixar aqui:

* [https://www.postgresql.org/download/](https://nodejs.org/pt)

---

## 1.3. Crie o banco de dados e as tabelas

1. Abra o **pgAdmin** ou o terminal.
2. Crie um banco de dados com o nome desejado.
3. Abra o arquivo `bd.psql` localizado na pasta **backend** do projeto.
4. Execute o conteúdo desse arquivo no seu banco para criar todas as tabelas necessárias.

---

## 1.4. Configurar variáveis de ambiente (.env)

Na pasta **backend**, edite o arquivo `.env` e coloque:

```
DATABASE_URL="postgresql://postgres:SENHA@localhost:5432/BANCO_DE_DADOS"
```

Certifique-se de usar **sua senha do PostgreSQL** e o **nome do banco criado**.

---

## 1.5. Iniciar o servidor backend

No terminal do VSCode:

1. Entre na pasta **backend**

```
cd backend
```

2. Inicie o servidor:

```
node index.js
```

➡️ **Mantenha essa janela aberta** — o backend precisa estar rodando.

---

# 📱 2. Configuração do Frontend (Mobile React Native + Expo)

## 2.1. Instale as dependências do projeto mobile

No terminal:

```
cd mobile
npm install
```

---

## 2.2. Pegue seu IP local

No **CMD do Windows**, execute:

```
ipconfig
```

Procure pelo campo **IPv4**.
Exemplo:

```
IPv4: 192.168.15.5
```

---

## 2.3. Atualize o IP nos arquivos do projeto

### 📌 2.3.1. Arquivo: `src/contexts/AuthContext.tsx`

Troque a linha:

```
const API_URL = 'http://192.168.15.5:3000';
```

Para:

```
const API_URL = 'http://SEU_IPV4:3000';
```

### 📌 2.3.2. Arquivo: `src/services/api.ts`

Troque:

```
baseURL: `http://192.168.15.5:3000`
```

Por:

```
baseURL: `http://SEU_IPV4:3000`
```

⚠️ **É obrigatório usar o seu IPv4**, pois o Expo Go acessa a API pela rede Wi-Fi.

---

# ▶️ 3. Executando o projeto

## 3.1. Inicie o backend (se ainda não estiver rodando)

```
cd backend
node index.js
```

---

## 3.2. Inicie o app mobile

Em outro terminal:

```
cd mobile
npx expo start --clear
```

Isso abrirá um QRCode no terminal ou no navegador.

---

# 📲 4. Executando no celular (Expo Go)

## 4.1. Instale o app **Expo Go**

* Android: [https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)
* iOS: [https://itunes.apple.com/app/apple-store/id982107779](https://itunes.apple.com/app/apple-store/id982107779)

---

## 4.2. Abrir o app no celular

### ✔️ Android

Abra o **Expo Go** → toque em **Scan QR Code** → aponte a câmera para o QR Code do terminal.

### ✔️ iOS

Abra a **câmera do iPhone** → leia o QR Code → abrirá automaticamente no Expo Go.

---

# 🎉 5. Pronto!

Após o carregamento, o app abrirá no seu celular.

Agora é só **criar um usuário**, fazer login e usar o sistema normalmente.
