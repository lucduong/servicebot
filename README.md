# Setup Env

## 1. Clone source
```bash 
git clone https://github.com/lucduong/servicebot.git
```

## 2. Install Dependencies
```bash
cd servicebot
npm i
```

## 3. Install Postgresql
### 3.1 Windows
- Download Installer package from official Postgres site.
- Flow Posgresql installation.

### 3.2 Linux
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

## 4. Export Environment Props
Write these lines to the end of `~/.bash_profile` or `~/.zshrc`
```bash
export POSTGRES_DB_HOST=localhost
export POSTGRES_DB_PORT=5432
export POSTGRES_DB_USER=postgres
export POSTGRES_DB_PASSWORD=postgres
export POSTGRES_DB_NAME=postgres
```

Make sure that everything is availabel by sourcing env props.
```bash
source ~/.bash_profile
```

## 5. Build source
```bash
npm run build
```

## 6. Start service
```bash
node ./bin/start.js
```

## 7. Start with pm2
### 7.1 Install pm2 if not installed yet
```bash
npm i -g pm2
```

### 7.2 Start service
Navigate to source folder.

```bash
pm2 start ./bin/start.js --name=servicebot
```

